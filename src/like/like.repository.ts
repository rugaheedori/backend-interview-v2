import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';

@Injectable()
export class LikeRepository {
  constructor(private dbService: DbService, private logger: MyLogger) {}

  async isEnrolledProduct(productId: string): Promise<boolean> {
    try {
      const isEnrolled = await this.dbService.product.findUnique({
        select: {
          id: true,
        },
        where: {
          id: productId,
          deleted_time: null,
        },
      });

      return isEnrolled?.id != null;
    } catch (err) {
      this.logger.error(`isEnrolledProduct: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async isLiked(userId: string, productId: string): Promise<boolean> {
    try {
      const isLiked = await this.dbService.like.findUnique({
        select: {
          user_id: true,
        },
        where: {
          user_id_product_id: {
            user_id: userId,
            product_id: productId,
          },
        },
      });

      return isLiked?.user_id != null;
    } catch (err) {
      this.logger.error(`isLiked: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async like(userId: string, productId: string): Promise<void> {
    try {
      await this.dbService.like.create({
        data: {
          user_id: userId,
          product_id: productId,
        },
      });
    } catch (err) {
      this.logger.error(`like: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async unLike(userId: string, productId: string): Promise<void> {
    try {
        await this.dbService.like.delete({
          where: {
            user_id_product_id: {
              user_id: userId,
              product_id: productId,
            },
          },
        });
    } catch (err) {
      this.logger.error(`unLike: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
