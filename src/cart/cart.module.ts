import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartResolver } from './cart.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';

@Module({
  providers: [CartResolver, CartService],
  exports: [CartService],
  imports: [TypeOrmModule.forFeature([Cart])],
})
export class CartModule {}
