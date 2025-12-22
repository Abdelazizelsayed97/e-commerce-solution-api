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
import { EmailModule } from 'src/email/email.module';
import { Cart } from 'src/cart/entities/cart.entity';
import { ProductLoader } from './loader/product.loader';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { UserLoader } from 'src/user/loader/users.loader';
import { RatingAndReviewLoader } from 'src/rating-and-review/loaders/rating-and-review.loader';
import { CategoryLoader } from 'src/category/loaders/category.loader';
import { RatingAndReview } from 'src/rating-and-review/entities/rating-and-review.entity';

@Module({
  providers: [
    ProductResolver,
    ProductService,
    WishListResolver,
    WishListService,
    ProductLoader,
    VendorLoader,
    UserLoader,
    RatingAndReviewLoader,
    CategoryLoader,
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
      Cart,
      RatingAndReview,
    ]),
    EmailModule,
  ],
})
export class ProductModule {}
