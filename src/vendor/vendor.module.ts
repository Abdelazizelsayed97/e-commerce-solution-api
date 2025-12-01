import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorResolver } from './vendor.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  providers: [VendorResolver, VendorService],
  exports: [VendorService],
  imports: [TypeOrmModule.forFeature([Vendor]), UserModule, EmailModule],
})
export class VendorModule {}
