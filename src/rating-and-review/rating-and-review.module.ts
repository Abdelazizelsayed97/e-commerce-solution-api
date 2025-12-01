import { Module } from '@nestjs/common';
import { RatingAndReviewService } from './rating-and-review.service';
import { RatingAndReviewResolver } from './rating-and-review.resolver';

@Module({
  providers: [RatingAndReviewResolver, RatingAndReviewService],
})
export class RatingAndReviewModule {}
