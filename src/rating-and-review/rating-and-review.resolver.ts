import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { RatingAndReviewService } from './rating-and-review.service';
import { RatingAndReview } from './entities/rating-and-review.entity';
import { CreateRatingAndReviewInput } from './dto/create-rating-and-review.input';
import { UpdateRatingAndReviewInput } from './dto/update-rating-and-review.input';
import type { Request } from 'express';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { User } from 'src/user/entities/user.entity';
import DataLoader from 'dataloader';
import { Product } from 'src/product/entities/product.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { ProductLoader } from 'src/product/loader/product.loader';
import { UserLoader } from 'src/user/loader/users.loader';
import { VendorLoader } from 'src/vendor/loaders/vendor.loader';
import { PaginatedReview } from './entities/paginated-review';

@Resolver(() => RatingAndReview)
export class RatingAndReviewResolver {
  constructor(
    private readonly ratingAndReviewService: RatingAndReviewService,
    private readonly productLoader: ProductLoader,
    private readonly userLoader: UserLoader,
    private readonly vendorLoader: VendorLoader,
  ) {}

  @Mutation(() => RatingAndReview)
  createRatingAndReview(
    request: Request,
    @Args('createRatingAndReviewInput')
    createRatingAndReviewInput: CreateRatingAndReviewInput,
    @CurrentUser() user: User,
  ) {
    return this.ratingAndReviewService.addReview(
      user.id,
      createRatingAndReviewInput.productId,
      createRatingAndReviewInput,
    );
  }

  @Query(() => PaginatedReview, { name: 'ratingAndReview', nullable: true })
  findAllReviews(
    @Args('productId', { type: () => String }) productId: string,
    @Args('paginate', { type: () => PaginationInput, nullable: true })
    paginate?: PaginationInput,
  ) {
    return this.ratingAndReviewService.getProductReviews(productId, paginate);
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
  @ResolveField(() => Product)
  async product(@Parent() review: RatingAndReview) {
    if (!review.product) return null;
    return this.productLoader.loader().load(review.product.id);
  }

  @ResolveField(() => User)
  async user(@Parent() review: RatingAndReview) {
    if (!review.user) return null;
    return this.userLoader.loader().load(review.user.id);
  }
  @ResolveField(() => Vendor, { nullable: true })
  async vendor(@Parent() review: RatingAndReview) {
    if (!review.product.vendor) return null;
    return this.vendorLoader.loader().load(review.product.vendor.id);
  }
}
