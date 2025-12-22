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
import { OrderLoader } from './loaders/order.loader';
import { OrderItemLoader } from './loaders/order-item.loader';
import { UserLoader } from 'src/user/loader/users.loader';
import { CartLoader } from 'src/cart/loaders/cart.loader';
import { ProductLoader } from 'src/product/loader/product.loader';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { User } from 'src/user/entities/user.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  providers: [
    OrderResolver,
    OrderService,
    OrderLoader,
    OrderItemLoader,
    UserLoader,
    CartLoader,
    ProductLoader,
    VendorLoader,
    {
      provide: 'PAYMENT_SERVICE',
      useValue: PaymentService,
    },
  ],
  exports: [OrderService],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Cart,
      CartItem,
      Product,
      User,
      Vendor,
    ]),
    PaymentModule,
    QueueModule,
  ],
})
export class OrderModule {}
