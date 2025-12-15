import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { WishList } from './entities/wish.list.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  providers: [ProductResolver, ProductService],
  exports: [ProductService],
  imports: [TypeOrmModule.forFeature([Product, Follower, WishList, Vendor])],
})
export class ProductModule {}
