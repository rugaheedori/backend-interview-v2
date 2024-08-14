import { Injectable } from '@nestjs/common';
import { LikeRepository } from './like.repository';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';

@Injectable()
export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  async like(userId: string, productId: string): Promise<void> {
    // 해당 상품이 존재하는 지 확인
    const isEnrolled = await this.likeRepository.isEnrolledProduct(productId);

    if (!isEnrolled) {
      throw new ErrorHandler(ErrorCode.NOT_FOUND, 'product', '해당 상품이 존재하지 않습니다.');
    }

    //  이미 좋아요 눌렀는 지 확인
    const isLiked = await this.likeRepository.isLiked(userId, productId);

    if (isLiked) {
      throw new ErrorHandler(ErrorCode.DUPLICATED, {}, '이미 해당 상품에 좋아요를 눌렀습니다.');
    }

    await this.likeRepository.like(userId, productId);
  }

  async unLike(userId: string, productId: string): Promise<void> {
    // 해당 상품이 존재하는 지 확인
    const isEnrolled = await this.likeRepository.isEnrolledProduct(productId);

    if (!isEnrolled) {
      throw new ErrorHandler(ErrorCode.NOT_FOUND, 'product', '해당 상품이 존재하지 않습니다.');
    }

    //  좋아요 눌렀는 지 확인
    const isLiked = await this.likeRepository.isLiked(userId, productId);

    if (!isLiked) {
      throw new ErrorHandler(ErrorCode.BAD_REQUEST, {}, '좋아요를 누른 상품이 아닙니다.');
    }

    await this.likeRepository.unLike(userId, productId);
  }
}
