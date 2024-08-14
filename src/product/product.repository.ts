import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { DbService } from '../db/db.service';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';
import { EnrollProduct } from './dto/enroll-product.dto';
import { ModifyProduct } from './dto/modify-product.dto';

@Injectable()
export class ProductRepository {
  constructor(private dbService: DbService, private logger: MyLogger) {}

  async checkEnrolledProduct(userId: string, data: EnrollProduct): Promise<boolean> {
    try {
      const productInfo = await this.dbService.product.findFirst({
        select: {
          id: true,
        },
        where: {
          user_id: userId,
          name: data.name,
          brand: data.brand,
          size: data.size,
          color: data.color,
        },
      });

      return productInfo?.id != null;
    } catch (err) {
      this.logger.error(`checkEnrolledProduct: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async createProduct(userId: string, data: EnrollProduct): Promise<void> {
    try {
      await this.dbService.product.create({
        data: {
          user_id: userId,
          name: data.name,
          description: data.description,
          brand: data.brand,
          price: data.price,
          size: data.size,
          color: data.color,
        },
      });
    } catch (err) {
      this.logger.error(`createProduct: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async getProductEnrollUserId(productId: string): Promise<string | null> {
    try {
      const productInfo = await this.dbService.product.findUnique({
        select: {
          user_id: true,
        },
        where: {
          id: productId,
        },
      });

      return productInfo?.user_id;
    } catch (err) {
      this.logger.error(`getProductEnrollUserId: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async updateProduct(data: ModifyProduct): Promise<void> {
    try {
      await this.dbService.product.update({
        data: {
          name: data.name,
          description: data.description,
          brand: data.brand,
          price: data.price,
          size: data.size,
          color: data.color,
          updated_time: dayjs().toISOString(),
        },
        where: {
          id: data.product_id,
        },
      });
    } catch (err) {
      this.logger.error(`updateProduct: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await this.dbService.product.update({
        data: {
          deleted_time: dayjs().toISOString(),
        },
        where: {
          id: productId,
        },
      });
    } catch (err) {
      this.logger.error(`deleteProduct: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
