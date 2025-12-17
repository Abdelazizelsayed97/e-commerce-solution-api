import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailModule } from 'src/email/email.module';
import { Fcm } from 'src/fcm/entities/fcm.entity';
import { CartModule } from 'src/cart/cart.module';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { WishList } from 'src/product/entities/wish.list.entity';
import { TempUser } from './entities/temp.user';

@Module({
  providers: [UserResolver, UserService],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([User, TempUser, Fcm, Wallet, WishList]),
    EmailModule,
    CartModule,
  ],
})
export class UserModule {}
