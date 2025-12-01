import { Test, TestingModule } from '@nestjs/testing';
import { RatingAndReviewResolver } from './rating-and-review.resolver';
import { RatingAndReviewService } from './rating-and-review.service';

describe('RatingAndReviewResolver', () => {
  let resolver: RatingAndReviewResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingAndReviewResolver, RatingAndReviewService],
    }).compile();

    resolver = module.get<RatingAndReviewResolver>(RatingAndReviewResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
