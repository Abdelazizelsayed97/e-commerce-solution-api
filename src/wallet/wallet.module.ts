import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletResolver } from './wallet.resolver';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [WalletResolver, WalletService],
  imports: [TypeOrmModule.forFeature([Wallet])],
  exports: [WalletService],
})
export class WalletModule {}
