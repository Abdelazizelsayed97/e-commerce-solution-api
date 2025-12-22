import { Module } from '@nestjs/common';
import { RequestVendorService } from './request_vendor.service';
import { RequestVendorResolver } from './request_vendor.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestVendor } from './entities/request_vendor.entity';
import { UserModule } from 'src/user/user.module';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { User } from 'src/user/entities/user.entity';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';

@Module({
  providers: [RequestVendorResolver, RequestVendorService, VendorLoader],
  exports: [RequestVendorService],
  imports: [
    TypeOrmModule.forFeature([RequestVendor, Vendor, User]),
    UserModule,
  ],
})
export class RequestVendorModule {}
