import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestVendor } from './entities/request_vendor.entity';
import { RequestVendorEnum } from 'src/core/enums/request.vendor.status';
import { UserService } from 'src/user/user.service';
import { CreateRequestVendorInput } from './dto/create-request_vendor.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { PaginatedRequestVendor } from './entities/request.vendor.paginate';
import { RoleEnum } from 'src/core/enums/role.enum';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RequestVendorService {
  constructor(
    @InjectRepository(RequestVendor)
    private requestVendorRepository: Repository<RequestVendor>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async requestBeVendor(createRequestVendorInput: CreateRequestVendorInput) {
    const user = await this.userRepository.findOne({
      where: {
        id: createRequestVendorInput.user_id,
      },
    });
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const vendor = await this.vendorRepository.findOne({
      where: {
        user: {
          id: createRequestVendorInput.user_id,
        },
      },
    });
    console.log('vendorvendorvendor', user);

    if (vendor) {
      throw new NotFoundException('vendor already exist');
    }

    const nv = this.vendorRepository.create({
      rating: 0,
      balance: 0,
      isVerfied: false,
      shopName: createRequestVendorInput.shopName,
      user: user,
    });
    const newNv = await this.vendorRepository.save(nv);
    console.log('nvnvnvn', newNv);

    const request = this.requestVendorRepository.create({
      ...createRequestVendorInput,
      status: RequestVendorEnum.pending,
      vendor: newNv,
    });
    console.log('requestrequest', request);

    return await this.requestVendorRepository.save({
      ...request,
      status: RequestVendorEnum.pending,
      vendor: nv,
    });
  }

  async approveRequestVendor(id: string) {
    const request = await this.requestVendorRepository.findOne({
      where: { id: id },
      relations: {
        vendor: {
          user: true,
        },
      },
    });
    console.log('requestrequest', request);

    if (!request) {
      throw new NotFoundException('request not found');
    }
    if (request.status === RequestVendorEnum.approve) {
      throw new NotFoundException('request already approved');
    }
    request.status = RequestVendorEnum.approve;
    await this.requestVendorRepository.save(request);

    request.vendor.isVerfied = true;

    await this.vendorRepository.save(request.vendor);
    request.vendor.user.role = RoleEnum.vendor;
    request.vendor.user.isVendor = true;
    await this.userRepository.save(request.vendor.user);

    return request;
  }

  async rejectRequestVendor(id: string, message: string) {
    const request = await this.requestVendorRepository.findOne({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('request not found');
    }

    request.status = RequestVendorEnum.reject;
    request.rejectMessage = message;
    await this.requestVendorRepository.save(request);
    return request;
  }
  async findAll(
    paginate: PaginationInput,
    filterBy: RequestVendorEnum,
  ): Promise<PaginatedRequestVendor> {
    console.log('paginate', paginate);
    const skip = (paginate.page - 1) * paginate.limit;
    const take = paginate.limit;
    const [items, totalItems] = await this.requestVendorRepository.findAndCount(
      {
        skip: skip,
        take: take,
        relations: {
          vendor: true,
        },
        where: {
          status: filterBy,
        },
      },
    );
    console.log('fhjhf', items);
    return {
      items,
      pagination: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: take,
        totalPages: Math.ceil(totalItems / take),
        currentPage: paginate.page,
      },
    };
  }
}
