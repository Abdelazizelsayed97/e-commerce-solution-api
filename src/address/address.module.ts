import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { UserModule } from 'src/user/user.module';
import { AddressLoader } from './loaders/address.loader';

@Module({
  providers: [AddressResolver, AddressService, AddressLoader],
  exports: [AddressService],
  imports: [TypeOrmModule.forFeature([Address]), UserModule],
})
export class AddressModule {}
