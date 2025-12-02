import { Module } from '@nestjs/common';
import { RequestVendorService } from './request_vendor.service';
import { RequestVendorResolver } from './request_vendor.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestVendor } from './entities/request_vendor.entity';
import { VendorModule } from 'src/vendor/vendor.module';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [RequestVendorResolver, RequestVendorService],
  exports: [RequestVendorService],
  imports: [
    TypeOrmModule.forFeature([RequestVendor]),
    UserModule,
    VendorModule,
  ],
})
export class RequestVendorModule {}
