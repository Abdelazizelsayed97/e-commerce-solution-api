import { Test, TestingModule } from '@nestjs/testing';
import { FcmResolver } from './fcm.resolver';
import { FcmService } from './fcm.service';

describe('FcmResolver', () => {
  let resolver: FcmResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FcmResolver, FcmService],
    }).compile();

    resolver = module.get<FcmResolver>(FcmResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
