import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { RatingAndReview } from '../entities/rating-and-review.entity';
import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable({
  scope: Scope.REQUEST,
})
export class RatingAndReviewLoader {
  constructor(
    @InjectRepository(RatingAndReview)
    private readonly ratingAndReviewRepo: Repository<RatingAndReview>,
  ) {}

  loader() {
    return new DataLoader<string, RatingAndReview>(async (ids) => {
      const ratings = await this.ratingAndReviewRepo.find({
        where: {
          product: {
            id: In(ids as string[]),
          },
        },
        // relations: {
        //   user: true,
        //   product: {
        //     vendor: true,
        //   },
        // },
      });

      const map = new Map(ratings.map((r) => [r.id, r]));

      return ids.map((id) => {
        const rating = map.get(id);
        return rating ?? new Error(`RatingAndReview not found: ${id}`);
      });
    });
  }
}
