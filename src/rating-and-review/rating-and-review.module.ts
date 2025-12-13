import { Module } from '@nestjs/common';
import { RatingAndReviewService } from './rating-and-review.service';
import { RatingAndReviewResolver } from './rating-and-review.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingAndReview } from './entities/rating-and-review.entity';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { Order } from 'src/order/entities/order.entity';

@Module({
  providers: [RatingAndReviewResolver, RatingAndReviewService],
  exports: [RatingAndReviewService],
  imports: [
    TypeOrmModule.forFeature([RatingAndReview, Order]),
    ProductModule,
    UserModule,
  ],
})
export class RatingAndReviewModule {}
