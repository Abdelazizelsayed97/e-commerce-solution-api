import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RatingAndReviewService } from './rating-and-review.service';
import { RatingAndReview } from './entities/rating-and-review.entity';
import { CreateRatingAndReviewInput } from './dto/create-rating-and-review.input';
import { UpdateRatingAndReviewInput } from './dto/update-rating-and-review.input';
import type { Request } from 'express';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Resolver(() => RatingAndReview)
export class RatingAndReviewResolver {
  constructor(
    private readonly ratingAndReviewService: RatingAndReviewService,
  ) {}

  @Mutation(() => RatingAndReview)
  createRatingAndReview(
    request: Request,
    @Args('createRatingAndReviewInput')
    createRatingAndReviewInput: CreateRatingAndReviewInput,
    @CurrentUser() user: any,
  ) {
    return this.ratingAndReviewService.addReview(
      user.id,
      createRatingAndReviewInput.productId,
      createRatingAndReviewInput,
    );
  }

  @Query(() => [RatingAndReview], { name: 'ratingAndReview',nullable: true })
  findAll(
    @Args('productId', { type: () => String }) productId: string,
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate?: PaginationInput,

  ) {
    return this.ratingAndReviewService.getProductReviews(productId,paginate);
  }

  @Mutation(() => RatingAndReview)
  updateRatingAndReview(
    @Args('updateRatingAndReviewInput')
    updateRatingAndReviewInput: UpdateRatingAndReviewInput,
    @CurrentUser() user: any,
  ) {
    return this.ratingAndReviewService.updateReview(
      user.id,
      updateRatingAndReviewInput.id,
      updateRatingAndReviewInput,
    );
  }

  @Mutation(() => RatingAndReview)
  removeRatingAndReview(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: any,
  ) {
    return this.ratingAndReviewService.deleteReview(user.id, id);
  }
}
