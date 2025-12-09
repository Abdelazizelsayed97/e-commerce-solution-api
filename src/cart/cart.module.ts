import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  providers: [CartResolver, CartService],
  exports: [CartService],
  imports: [TypeOrmModule.forFeature([Cart, CartItem, User])],
})
export class CartModule { }
