import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { VendorTransaction } from './entities/vendor-transaction.entity';
import { User } from 'src/user/entities/user.entity';
import { Order } from 'src/order/entities/order.entity';

@Module({
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      Wallet,
      VendorTransaction,
      User,
      Order,
    ]),
  ],
})
export class TransactionModule {}
