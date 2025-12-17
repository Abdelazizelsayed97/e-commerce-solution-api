import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemResolver } from './cart-item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CartModule } from 'src/cart/cart.module';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  providers: [CartItemResolver, CartItemService],
  exports: [CartItemService],
  imports: [
    TypeOrmModule.forFeature([CartItem, Cart, Product, Vendor]),
    CartModule,
  ],
})
export class CartItemModule {}
