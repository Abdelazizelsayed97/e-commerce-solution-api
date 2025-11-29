import { Module } from '@nestjs/common';
import { CartItemService } from './cart_item.service';
import { CartItemResolver } from './cart_item.resolver';

@Module({
  providers: [CartItemResolver, CartItemService],
})
export class CartItemModule {}
