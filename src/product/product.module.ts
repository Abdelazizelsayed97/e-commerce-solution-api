import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { WishListResolver } from './wishlist.resolver';
import { WishListService } from './wish.list.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Follower } from 'src/followers/entities/follower.entity';
import { WishList } from './entities/wish.list.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    WishListResolver,
    WishListService,
  ],
  exports: [ProductService, WishListService],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Follower,
      WishList,
      Vendor,
      User,
      Category,
    ]),
  ],
})
export class ProductModule {}
