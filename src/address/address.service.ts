import { Injectable } from '@nestjs/common';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { S } from 'node_modules/graphql-ws/dist/common-DY-PBNYy.cjs';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createAddressInput: CreateAddressInput) {
    const isExist = await this.addressRepository.findOne({
      where: {
        state: createAddressInput.state,
        city: createAddressInput.city,
        address: createAddressInput.details,
      },
    });
    if (isExist) {
      throw new Error('address already exist');
    }
    Object.create(createAddressInput);
    return this.addressRepository.save({
      ...createAddressInput,
    });
  }

  findAll() {
    return `This action returns all address`;
  }

  findOne(id: number) {
    return `This action returns a #${id} address`;
  }

  update(id: string, updateAddressInput: UpdateAddressInput) {
    return `This action updates a #${id} address`;
  }

  async remove(id: string) {
    return `This action removes a #${id} address`;
  }
}
