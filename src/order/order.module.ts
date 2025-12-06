import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart_item/entities/cart_item.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    {
      provide: 'PAYMENT_SERVICE',
      useValue: null,
    },
  ],
  exports: [OrderService],
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Cart, CartItem, Product])],
})
export class OrderModule {}
