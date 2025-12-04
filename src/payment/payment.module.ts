import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { CartModule } from 'src/cart/cart.module';
import { OrderModule } from 'src/order/order.module';
import { Module } from '@nestjs/common';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([Order, User]),
    WalletModule,
    TransactionModule,
    CartModule,
    OrderModule,
  ],
})
export class PaymentModule {}
