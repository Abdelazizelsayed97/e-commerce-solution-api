import { Field, ObjectType } from '@nestjs/graphql';
import { RatingAndReview } from './rating-and-review.entity';
import { PaginatedType } from 'src/core/helper/pagination/pagination.output';

@ObjectType()
export class PaginatedReview extends PaginatedType(RatingAndReview) {}
