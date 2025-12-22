import { Injectable } from '@nestjs/common';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { UserService } from 'src/user/user.service';
import { PaginatedAddress } from './entities/paginated.address';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(createAddressInput: CreateAddressInput, user: User) {
    const isExist = await this.addressRepository.findOne({
      where: {
        state: createAddressInput.state,
        city: createAddressInput.city,
        details: createAddressInput.details,
        user_id: user.id,
      },
    });

    if (isExist) {
      throw new Error('address already exist');
    }

    const address = this.addressRepository.create({
      ...createAddressInput,
      user_id: user.id,
    });
    return await this.addressRepository.save(address);
  }
  async findAllBoard(paginated: PaginationInput): Promise<PaginatedAddress> {
    const skip = (paginated.page - 1) * paginated.limit;

    const [items, totalCount] = await this.addressRepository.findAndCount({
      skip,
      take: paginated.limit,
      relations: {
        user: true,
      },
    });
    return {
      items: items,
      limit: paginated.limit,
      page: paginated.page,
      total: totalCount,
    };
  }

  async findAllAddresses(
    paginated: PaginationInput,
    user?: User,
  ): Promise<PaginatedAddress> {
    const skip = (paginated.page - 1) * paginated.limit;

    const [items, totalCount] = await this.addressRepository.findAndCount({
      skip,
      take: paginated.limit,

      where: user ? { user_id: user.id } : {},
    });
    return {
      items: items,
      limit: paginated.limit,
      page: paginated.page,
      total: totalCount,
    };
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
