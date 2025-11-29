import { Module } from '@nestjs/common';
import { VendorOrdersService } from './vendor_orders.service';
import { VendorOrdersResolver } from './vendor_orders.resolver';

@Module({
  providers: [VendorOrdersResolver, VendorOrdersService],
})
export class VendorOrdersModule {}
