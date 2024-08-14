import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { DbModule } from '../db/db.module';
import { ReviewRepository } from './review.repository';
import { MyLogger } from '../utils/logger';

@Module({
  imports: [DbModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, MyLogger],
})
export class ReviewModule {}
