import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRatingAndReviewInput } from './dto/create-rating-and-review.input';
import { UpdateRatingAndReviewInput } from './dto/update-rating-and-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingAndReview } from './entities/rating-and-review.entity';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { CurrentUser } from 'src/core/helper/decorators/current.user';
import { User } from 'src/user/entities/user.entity';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';

@Injectable()
export class RatingAndReviewService {
  constructor(
    @InjectRepository(RatingAndReview)
    private reviewsRepository: Repository<RatingAndReview>,
    private usersService: UserService,
    private productsService: ProductService,
  ) {}

  async addReview(
    userId: string,
    productId: string,
    createReviewDto: CreateRatingAndReviewInput,
  ): Promise<RatingAndReview> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      user,
      product,
    });
    return this.reviewsRepository.save(review);
  }

  async updateReview(
    userId: string,
    reviewId: string,
    updateReviewDto: UpdateRatingAndReviewInput,
  ): Promise<RatingAndReview> {
    const review = await this.reviewsRepository.findOne({
      where: {
        id: reviewId,
        user: { id: userId },
      },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (updateReviewDto.rating !== undefined) {
      review.rating = updateReviewDto.rating;
    }
    if (updateReviewDto.comment !== undefined) {
      review.comment = updateReviewDto.comment;
    }
    return this.reviewsRepository.save(review);
  }

  async deleteReview(userId: string, reviewId: string): Promise<void> {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId, user: { id: userId } },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.reviewsRepository.remove(review);
  }

  async getProductReviews(
    productId: string,
    paginate?: PaginationInput,
  ): Promise<RatingAndReview[]> {
    const skip = (paginate!.page - 1) * paginate!.limit;
    const take = paginate?.limit;
    return this.reviewsRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
      skip: skip,
      take: take,
    });
  }
}
