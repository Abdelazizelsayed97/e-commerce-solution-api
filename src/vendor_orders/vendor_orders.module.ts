import { Module } from '@nestjs/common';
import { VendorOrdersService } from './vendor_orders.service';
import { VendorOrdersResolver } from './vendor_orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorOrder } from './entities/vendor_order.entity';

@Module({
  providers: [VendorOrdersResolver, VendorOrdersService],
  exports: [VendorOrdersService],
  imports: [TypeOrmModule.forFeature([VendorOrder])],
})
export class VendorOrdersModule {}
