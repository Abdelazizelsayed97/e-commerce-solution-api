import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { WishList } from './entities/wish.list.entity';

@Module({
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, Follower, WishList])],
})
export class ProductModule {}
