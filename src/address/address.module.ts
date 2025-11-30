import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';

@Module({
  providers: [AddressResolver, AddressService],
  exports: [AddressService],
  imports: [TypeOrmModule.forFeature([Address])],
})
export class AddressModule {}
