import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateRatingAndReviewInput } from './dto/create-rating-and-review.input';
import { UpdateRatingAndReviewInput } from './dto/update-rating-and-review.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingAndReview } from './entities/rating-and-review.entity';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { PaginationInput } from 'src/core/helper/pagination/paginatoin-input';
import { Order } from 'src/order/entities/order.entity';

@Injectable()
export class RatingAndReviewService {
  constructor(
    @InjectRepository(RatingAndReview)
    private reviewsRepository: Repository<RatingAndReview>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private usersService: UserService,
    private productsService: ProductService,
  ) {}

  private async verifyUserPurchase(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const order = await this.ordersRepository.findOne({
      where: {
        client: { id: userId },
        orderItems: { product: { id: productId } },
      },
      relations: ['orderItems', 'orderItems.product'],
    });
    return !!order;
  }

  async addReview(
    userId: string,
    productId: string,
    createReviewDto: CreateRatingAndReviewInput,
  ): Promise<RatingAndReview> {
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    console.log('userId', userId);
    const product = await this.productsService.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const hasPurchased = await this.verifyUserPurchase(userId, productId);
    if (!hasPurchased) {
      throw new ForbiddenException(
        'You can only review products you have purchased',
      );
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      user,
      product,
    });
    return await this.reviewsRepository.save(review);
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
    return await this.reviewsRepository.save(review);
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

  async getProductReviews(productId: string, paginate?: PaginationInput) {
    const skip = (paginate!.page - 1) * paginate!.limit;
    const take = paginate?.limit;
    const [items, totalItems] = await this.reviewsRepository.findAndCount({
      where: { product: { id: productId } },
      relations: ['user', 'product'],
      skip,
      take,
    });
    return {
      items: items,
      total: totalItems,
      page: paginate?.page,
      limit: paginate?.limit,
    };
  }
}
