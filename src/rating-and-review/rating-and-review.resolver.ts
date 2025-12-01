import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RatingAndReviewService } from './rating-and-review.service';
import { RatingAndReview } from './entities/rating-and-review.entity';
import { CreateRatingAndReviewInput } from './dto/create-rating-and-review.input';
import { UpdateRatingAndReviewInput } from './dto/update-rating-and-review.input';

@Resolver(() => RatingAndReview)
export class RatingAndReviewResolver {
  constructor(private readonly ratingAndReviewService: RatingAndReviewService) {}

  @Mutation(() => RatingAndReview)
  createRatingAndReview(@Args('createRatingAndReviewInput') createRatingAndReviewInput: CreateRatingAndReviewInput) {
    return this.ratingAndReviewService.create(createRatingAndReviewInput);
  }

  @Query(() => [RatingAndReview], { name: 'ratingAndReview' })
  findAll() {
    return this.ratingAndReviewService.findAll();
  }

  @Query(() => RatingAndReview, { name: 'ratingAndReview' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ratingAndReviewService.findOne(id);
  }

  @Mutation(() => RatingAndReview)
  updateRatingAndReview(@Args('updateRatingAndReviewInput') updateRatingAndReviewInput: UpdateRatingAndReviewInput) {
    return this.ratingAndReviewService.update(updateRatingAndReviewInput.id, updateRatingAndReviewInput);
  }

  @Mutation(() => RatingAndReview)
  removeRatingAndReview(@Args('id', { type: () => Int }) id: number) {
    return this.ratingAndReviewService.remove(id);
  }
}
