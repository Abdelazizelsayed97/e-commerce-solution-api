import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletResolver } from './wallet.resolver';
import { Wallet } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { WalletLoader } from './loaders/wallet.loader';

@Module({
  providers: [WalletResolver, WalletService, WalletLoader],
  imports: [TypeOrmModule.forFeature([Wallet]), UserModule],
  exports: [WalletService],
})
export class WalletModule {}
