import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AddressModule } from 'src/address/address.module';
import { EmailModule } from 'src/email/email.module';
import { Fcm } from 'src/fcm/entities/fcm.entity';

@Module({
  providers: [UserResolver, UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User, Fcm]), AddressModule, EmailModule],
})
export class UserModule {}
