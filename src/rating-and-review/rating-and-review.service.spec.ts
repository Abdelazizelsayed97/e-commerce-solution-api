import { Test, TestingModule } from '@nestjs/testing';
import { RatingAndReviewService } from './rating-and-review.service';

describe('RatingAndReviewService', () => {
  let service: RatingAndReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingAndReviewService],
    }).compile();

    service = module.get<RatingAndReviewService>(RatingAndReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
