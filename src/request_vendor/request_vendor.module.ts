import { Module } from '@nestjs/common';
import { RequestVendorService } from './request_vendor.service';
import { RequestVendorResolver } from './request_vendor.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestVendor } from './entities/request_vendor.entity';
import { UserModule } from 'src/user/user.module';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  providers: [RequestVendorResolver, RequestVendorService],
  exports: [RequestVendorService],
  imports: [TypeOrmModule.forFeature([RequestVendor, Vendor]), UserModule],
})
export class RequestVendorModule {}
