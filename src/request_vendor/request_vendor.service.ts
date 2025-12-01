import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestVendor } from './entities/request_vendor.entity';
import { RequestVendorEnum } from 'src/core/enums/request.vendor.status';

@Injectable()
export class RequestVendorService {
  constructor(
    @InjectRepository(RequestVendor)
    private requestVendorRepository: Repository<RequestVendor>,
  ) {}

  async aproveRequestVendor(id: string,status:RequestVendorEnum) {
    const request = await this.requestVendorRepository.findOne({
      where: { id },
    });
    if (!request) {
      throw new NotFoundException('request not found');
    }

    return await this.requestVendorRepository.update(id, {
      status: status,
    });
  }
}
