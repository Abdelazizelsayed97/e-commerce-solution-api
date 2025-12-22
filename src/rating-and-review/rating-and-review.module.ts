import { Module } from '@nestjs/common';
import { RatingAndReviewService } from './rating-and-review.service';
import { RatingAndReviewResolver } from './rating-and-review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingAndReview } from './entities/rating-and-review.entity';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { Order } from 'src/order/entities/order.entity';
import { RatingAndReviewLoader } from './loaders/rating-and-review.loader';
import { ProductLoader } from 'src/product/loader/product.loader';
import { UserLoader } from 'src/user/loader/users.loader';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  providers: [
    RatingAndReviewResolver,
    RatingAndReviewService,
    RatingAndReviewLoader,
    ProductLoader,
    UserLoader,
    VendorLoader,
  ],
  exports: [RatingAndReviewService],
  imports: [
    TypeOrmModule.forFeature([RatingAndReview, Order, User, Product, Vendor]),
    ProductModule,
    UserModule,
  ],
})
export class RatingAndReviewModule {}
