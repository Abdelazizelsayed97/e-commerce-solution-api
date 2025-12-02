import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestVendor } from './entities/request_vendor.entity';
import { RequestVendorEnum } from 'src/core/enums/request.vendor.status';
import { UserService } from 'src/user/user.service';
import { VendorService } from 'src/vendor/vendor.service';
import { CreateRequestVendorInput } from './dto/create-request_vendor.input';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class RequestVendorService {
  constructor(
    @InjectRepository(RequestVendor)
    private requestVendorRepository: Repository<RequestVendor>,
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,

    private readonly userService: UserService,
  ) {}

  async requestBeVendor(createRequestVendorInput: CreateRequestVendorInput) {
    const user = await this.userService.findOne(
      createRequestVendorInput.user_id,
    );
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
    console.log('vendorvendorvendor');

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
    console.log('nvnvnvn', nv);

    const request = this.requestVendorRepository.create({
      status: RequestVendorEnum.pending,
      vendor: nv,
    });
    console.log('requestrequest', request);

    return await this.requestVendorRepository.save({
      ...request,
      status: RequestVendorEnum.pending,
      vendor: nv,
      
    });
  }
  async aproveRequestVendor(id: string) {
    const request = await this.requestVendorRepository.findOne({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('request not found');
    }

    return await this.requestVendorRepository.update(id, {
      status: RequestVendorEnum.aprovel,
    });
  }
  async rejectRequestVendor(id: string, message: string) {
    const request = await this.requestVendorRepository.findOne({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('request not found');
    }
    await this.requestVendorRepository.update(id, {
      status: RequestVendorEnum.reject,
    });
    this.removeRequest(id);
    return {
      message: message,
      status: RequestVendorEnum.reject,
    };
  }
  async findAll(paginate: PaginationInput) {
    return await this.requestVendorRepository.find({
      relations: {
        vendor: true,
      },
      skip: (paginate.page - 1) * paginate.limit,
      take: paginate.limit,
    });
  }
  private async removeRequest(id: string) {
    return await this.requestVendorRepository.delete(id);
  }
}
