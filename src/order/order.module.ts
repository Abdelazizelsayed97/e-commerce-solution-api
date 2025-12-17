import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { CartItem } from 'src/cart-item/entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentModule } from 'src/payment/payment.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    {
      provide: 'PAYMENT_SERVICE',
      useValue: PaymentService,
    },
  ],
  exports: [OrderService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Cart, CartItem, Product]),
    PaymentModule,
    QueueModule,
  ],
})
export class OrderModule {}
