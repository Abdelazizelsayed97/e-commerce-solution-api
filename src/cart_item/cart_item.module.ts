import { Module } from '@nestjs/common';
import { CartItemService } from './cart_item.service';
import { CartItemResolver } from './cart_item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart_item.entity';
import { CartModule } from 'src/cart/cart.module';

@Module({
  providers: [CartItemResolver, CartItemService],
  exports: [CartItemService],
  imports: [TypeOrmModule.forFeature([CartItem]), CartModule],
})
export class CartItemModule {}
