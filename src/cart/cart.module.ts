import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [CartResolver, CartService],
  exports: [CartService],
  imports: [TypeOrmModule.forFeature([Cart]), UserModule],
})
export class CartModule {}
