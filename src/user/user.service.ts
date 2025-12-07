import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { RegisterInput } from 'src/auth/dto/register.input';
import { LoginInput } from 'src/auth/dto/login-input';
import { hashSync, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async create(registerInput: RegisterInput) {
    const isExist = await this.usersRepository.findOne({
      where: {
        email: registerInput.email,
      },
    });
    if (isExist) {
      throw new Error('user already exist');
    }

    console.log('this service is running', registerInput);
    const user = await this.usersRepository.create({
      email: registerInput.email,
      password: registerInput.password,
      name: registerInput.name,
      phoneNumber: registerInput.phoneNumber,

      role: registerInput.role,
    });
    const code = await this.sendNotificationToNewUserWithVerificationCode(user);

    user.OtpCode = code;
    user.token = await this.generateToken(user.id);

    const result = await this.usersRepository.save(user);
    console.log('log from service', result);
    return result;
  }

  async findAll(paginate: PaginationInput) {
    const limit = paginate.limit;
    const page = (paginate.page - 1) * limit;
    return await this.usersRepository.find({
      skip: page,
      take: limit,
      relations: {
        address: true,
        vendor: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }
    return user;
  }

  async findByEmail(email: string) {
    return `This action returns a #${email} user`;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }
    Object.assign(user, updateUserInput);
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }
  async verifyUser(input: LoginInput): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: input.email },
      relations: {
        vendor: true,
      },
    });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    const hashedPassword = hashSync(input.password, 10);
    if (await compare(hashedPassword, user.password)) {
      throw new Error('Invalid credentials');
    } else {
      user.token = await this.generateToken(user.id);
      await this.usersRepository.save(user);
      return user;
    }
  }
  private async generateToken(user_id: string) {
    const tokenPayload = { id: user_id };
    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
    return token;
  }

  async verifyUserEmail(userId: string, code: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    if (user.OtpCode! !== code) {
      throw new Error('Invalid verification code');
    }
    return user;
  }

  private async sendNotificationToNewUserWithVerificationCode(user: User) {
    const codde = Math.floor(100000 + Math.random() * 900000).toString();
    await this.emailService.sendVerificationEmail(user, codde);
    return codde;
  }
}
