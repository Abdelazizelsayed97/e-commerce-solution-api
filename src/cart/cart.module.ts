import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UserModule } from 'src/user/user.module';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';

@Module({
  providers: [CartResolver, CartService],
  exports: [CartService],
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), UserModule],
})
export class CartModule {}
