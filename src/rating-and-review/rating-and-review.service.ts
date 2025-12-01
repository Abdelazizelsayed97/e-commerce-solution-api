import { Injectable } from '@nestjs/common';
import { CreateRatingAndReviewInput } from './dto/create-rating-and-review.input';
import { UpdateRatingAndReviewInput } from './dto/update-rating-and-review.input';

@Injectable()
export class RatingAndReviewService {
  create(createRatingAndReviewInput: CreateRatingAndReviewInput) {
    return 'This action adds a new ratingAndReview';
  }

  findAll() {
    return `This action returns all ratingAndReview`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ratingAndReview`;
  }

  update(id: number, updateRatingAndReviewInput: UpdateRatingAndReviewInput) {
    return `This action updates a #${id} ratingAndReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} ratingAndReview`;
  }
}
