import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { DbService } from '../db/db.service';
import { DbModule } from '../db/db.module';
import { MyLogger } from '../utils/logger';
import { ReviewRepository } from './review.repository';

describe('ReviewService', () => {
  let service: ReviewService;
  let repository: ReviewRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        ReviewRepository,
        { provide: DbService, useValue: DbModule },
        MyLogger,
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    repository = module.get<ReviewRepository>(ReviewRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
