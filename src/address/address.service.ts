import { Injectable } from '@nestjs/common';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,

    private userService: UserService,
  ) { }

  async create(createAddressInput: CreateAddressInput) {
    const isExist = await this.addressRepository.findOne({
      where: {
        state: createAddressInput.state,
        city: createAddressInput.city,
        details: createAddressInput.details,
      },
    });
    if (isExist) {
      throw new Error('address already exist');
    }
    const user = await this.userService.findOneById(createAddressInput.userid);
    const address = this.addressRepository.create({
      ...createAddressInput,
      user
    });
    return await this.addressRepository.save(address);
  }

  async findAll() {
    return await this.addressRepository.find();
  }

  async findOne(id: string) {
    if (!id || id.length === 0) {
      throw new Error('id is required');
    }
    return await this.addressRepository.findOneBy({ id });
  }

  async update(id: string, updateAddressInput: UpdateAddressInput) {
    const address = await this.addressRepository.findOneBy({ id });
    if (!address) {
      throw new Error('address not found');
    }
    Object.assign(address, updateAddressInput);
    return await this.addressRepository.save(address);
  }

  async remove(id: string) {
    return await this.addressRepository.delete(id);

  }
}
