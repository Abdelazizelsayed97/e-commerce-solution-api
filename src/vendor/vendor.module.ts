import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorResolver } from './vendor.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';

@Module({
  providers: [VendorResolver, VendorService],
  exports: [VendorService],
  imports: [TypeOrmModule.forFeature([Vendor])],
})
export class VendorModule {}
