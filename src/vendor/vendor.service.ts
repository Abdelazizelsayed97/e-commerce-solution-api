import { Injectable } from '@nestjs/common';
import { CreateVendorInput } from './dto/create-vendor.input';
import { UpdateVendorInput } from './dto/update-vendor.input';

@Injectable()
export class VendorService {
  create(createVendorInput: CreateVendorInput) {
    return 'This action adds a new vendor';
  }

  findAll() {
    return `This action returns all vendor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vendor`;
  }

  update(id: number, updateVendorInput: UpdateVendorInput) {
    return `This action updates a #${id} vendor`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendor`;
  }
}
