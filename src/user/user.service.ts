import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterInput } from 'src/auth/dto/register.input';
import { RoleService } from 'src/role/role.service';
import { AddressService } from 'src/address/address.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly roleService: RoleService,
    private readonly addressService: AddressService,
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
    const role = await this.roleService.findByName(registerInput.role);
    const addresses = await Promise.all(
      registerInput.address.map((address) =>
        this.addressService.create(address),
      ),
    );
    const user = this.usersRepository.create({
      ...registerInput,
      role: role,
      address: addresses,
    });
    return this.usersRepository.save(user);
  }

  async findAll() {
    return `This action returns all user`;
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
  private generateToken() {

  }
}
