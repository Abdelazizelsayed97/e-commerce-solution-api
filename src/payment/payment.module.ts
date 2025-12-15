import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { CartModule } from 'src/cart/cart.module';

import { Module } from '@nestjs/common';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { VendorTransaction } from 'src/transaction/entities/vendor-transaction.entity';
import { StockHistory } from 'src/product/entities/stock-history.entity';
import { Product } from 'src/product/entities/product.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { CartItemModule } from 'src/cart_item/cart_item.module';
import { QueueModule } from 'src/queue/queue.module';
import { PaymentResolver } from './payment.resolver';

@Module({
  controllers: [PaymentController],
  providers: [PaymentResolver, PaymentService],
  exports: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([
      Order,
      User,
      Transaction,
      VendorTransaction,
      StockHistory,
      Product,
      OrderItem,
      Vendor,
      Wallet,
    ]),
    WalletModule,
    TransactionModule,
    CartModule,
    // OrderModule,
    CartItemModule,
    QueueModule,
    
  ],
})
export class PaymentModule {}
