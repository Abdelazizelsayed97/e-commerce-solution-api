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
import { Fcm } from 'src/fcm/entities/fcm.entity';
import { RoleEnum } from 'src/core/enums/role.enum';
import { PaginatedUsers } from './entities/paginated.user';
import { CartService } from 'src/cart/cart.service';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { TempUser } from './entities/temp.user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TempUser)
    private tempUserRepository: Repository<TempUser>,
    @InjectRepository(Fcm)
    private fcmRepository: Repository<Fcm>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private cartService: CartService,
  ) {}

  async create(registerInput: RegisterInput) {
    const isExist = await this.tempUserRepository.findOne({
      where: {
        email: registerInput.email,
      },
    });
    if (isExist) {
      throw new Error('user already exist');
    }

    const user = this.tempUserRepository.create({
      email: registerInput.email,
      password: hashSync(registerInput.password, 10),
      name: registerInput.name,
      phoneNumber: registerInput.phoneNumber,
      role: RoleEnum.client,
    });
    user.token = await this.generateToken(user.id);
    await this.tempUserRepository.save(user);
    const cart = await this.cartService.create({
      userId: user.id,
    });
    const wallet = this.walletRepository.create({
      user: user,
      balance: 0,
      pendingBalance: 0,
      currency: 'EGP',
      transactionHistory: [],
      type: 'wallet',
    });

    await this.walletRepository.save(wallet);
    user.wallet = wallet;

    const code = await this.sendNotificationToNewUserWithVerificationCode(user);
    user.cart = cart;
    user.OtpCode = code;

    const fcm = this.fcmRepository.create({
      user_id: user.id,
      token: registerInput.token,
      device: registerInput.device,
    });
    await this.fcmRepository.save(fcm);
    const result = await this.tempUserRepository.save(user);
    console.log('log from service', result);

    return result;
  }

  async findAll(paginate: PaginationInput): Promise<PaginatedUsers> {
    const limit = paginate.limit;
    const page = (paginate.page - 1) * limit;
    const [[token, ...users], totalItems] =
      await this.usersRepository.findAndCount({
        skip: page,
        take: limit,
      });
    return {
      items: users,
      pagination: {
        currentPage: paginate.page,
        totalItems: totalItems,
        itemCount: paginate.limit,
        itemsPerPage: paginate.limit,
        totalPages: Math.ceil(totalItems / paginate.limit),
      },
    };
  }

  async findOneById(id: string) {
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
    const user = this.usersRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException("user doesn't exist");
    }
    Object.assign(user, updateUserInput);
    return this.usersRepository.save(user);
  }

  async remove(id: string) {
    return await this.usersRepository.delete(id);
  }

  // login
  async verifyUser(input: LoginInput): Promise<User> {
    const user = await this.tempUserRepository.findOne({
      where: { email: input.email },
    });
    if (!user) {
      throw new Error('You have to verify your email first');
    }
    const isVerified = await this.usersRepository.findOne({
      where: { email: input.email },
    });
    if (!isVerified) {
      throw new Error('You have to verify your email first');
    }
    if (await compare(input.password, isVerified.password)) {
      user.token = await this.generateToken(user.id);
      await this.usersRepository.save(user);
      return user;
    }
    throw new Error('Invalid credentials');
  }

  private async generateToken(user_id: string) {
    const tokenPayload = { id: user_id };
    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
    });
    return token;
  }

  async verifyUserEmail(userId: string, code: string): Promise<User> {
    const user = await this.tempUserRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new Error("This user doesn't exist");
    }
    if (user.OtpCode! !== code) {
      throw new Error('Invalid verification code');
    }
    this.usersRepository.create({ ...user });
    await this.tempUserRepository.delete(user.id);
    return await this.usersRepository.save(user);
  }

  private async sendNotificationToNewUserWithVerificationCode(user: User) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.emailService.sendVerificationEmail(user, code);
    return code;
  }

  async forgetPassword(email: string) {
    const isExist = await this.usersRepository.findOne({
      where: { email: email },
    });
    if (!isExist) {
      throw new Error("This user doesn't exist");
    }
    const code =
      await this.sendNotificationToNewUserWithVerificationCode(isExist);
    return code;
  }
}
