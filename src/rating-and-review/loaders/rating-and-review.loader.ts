import DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { RatingAndReview } from '../entities/rating-and-review.entity';

export function RatingAndReviewLoader(
  ratingAndReviewRepo: Repository<RatingAndReview>,
) {
  return new DataLoader<string, RatingAndReview>(async (ids) => {
    const ratings = await ratingAndReviewRepo.find({
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
