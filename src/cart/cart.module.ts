import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { User } from 'src/user/entities/user.entity';
import { CartLoader } from './loaders/cart.loader';
import { UserLoader } from 'src/user/loader/users.loader';
import { CartItemLoader } from 'src/cart-item/loaders/cart.items.loader';

@Module({
  providers: [
    CartResolver,
    CartService,
    CartLoader,
    UserLoader,
    CartItemLoader,
  ],
  exports: [CartService],
  imports: [TypeOrmModule.forFeature([Cart, CartItem, User])],
})
export class CartModule {}
