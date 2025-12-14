import { Field, ObjectType } from '@nestjs/graphql';
import { RatingAndReview } from './rating-and-review.entity';
import { PaginationMeta } from 'src/core/helper/pagination/pagination.output';

@ObjectType()
export class PaginatedReview {
  @Field(() => [RatingAndReview])
  items: RatingAndReview[];

  @Field(() => PaginationMeta)
  pagination: PaginationMeta;
}
