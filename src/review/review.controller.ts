import { Controller, Post } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('api/review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  // 리뷰 조회

  // 리뷰 등록
  @Post()
  async createReview(): Promise<void> {
  }
  // 리뷰 수정

  // 리뷰 삭제
}
