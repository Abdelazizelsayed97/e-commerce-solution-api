import { Injectable } from '@nestjs/common';
import { CreateVendorOrderInput } from './dto/create-vendor_order.input';
import { UpdateVendorOrderInput } from './dto/update-vendor_order.input';

@Injectable()
export class VendorOrdersService {
  create(createVendorOrderInput: CreateVendorOrderInput) {
    return 'This action adds a new vendorOrder';
  }

  findAll() {
    return `This action returns all vendorOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vendorOrder`;
  }

  update(id: number, updateVendorOrderInput: UpdateVendorOrderInput) {
    return `This action updates a #${id} vendorOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} vendorOrder`;
  }
}
