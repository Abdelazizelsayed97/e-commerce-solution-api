import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionResolver } from './transaction.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { VendorTransaction } from './entities/vendor-transaction.entity';

@Module({
  providers: [TransactionResolver, TransactionService],
  exports: [TransactionService],
  imports: [TypeOrmModule.forFeature([Transaction, Wallet, VendorTransaction])],
})
export class TransactionModule {}
