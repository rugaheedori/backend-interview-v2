import { Injectable } from '@nestjs/common';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { EnrollProduct } from './dto/enroll-product.dto';
import { ModifyProduct } from './dto/modify-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async enrollProduct(userId: string, data: EnrollProduct): Promise<void> {
    // 같은 상품(이름, 브랜드, 색상, 사이즈 동일)이 이미 등록되어 있는지 확인
    const isEnrolled = await this.productRepository.checkEnrolledProduct(userId, data);

    if (isEnrolled) {
      throw new ErrorHandler(ErrorCode.DUPLICATED, 'product', '이미 등록된 상품입니다.');
    }

    await this.productRepository.createProduct(userId, data);
  }

  async modifyProduct(userId: string, data: ModifyProduct): Promise<void> {
    // 해당 product가 존재하는지 검증
    const productEnrollUserId = await this.productRepository.getProductEnrollUserId(
      data.product_id,
    );

    if (productEnrollUserId == null) {
      throw new ErrorHandler(ErrorCode.NOT_FOUND, 'product', '해당 상품이 존재하지 않습니다.');
    }

    // 해당 product를 등록한 사용자와 일치하는지 검증
    if (userId !== productEnrollUserId) {
      throw new ErrorHandler(ErrorCode.FORBIDDEN, 'user', '해당 상품을 수정할 권한이 없습니다.');
    }

    // 수정
    await this.productRepository.updateProduct(data);
  }

  async removeProduct(userId: string, productId: string): Promise<void> {
    // 실제로 삭제하는 것이 아닌 삭제처럼 보이는 처리
    // 해당 product가 존재하는 지 검증
    const productEnrollUserId = await this.productRepository.getProductEnrollUserId(productId);

    if (productEnrollUserId == null) {
      throw new ErrorHandler(ErrorCode.NOT_FOUND, 'product', '해당 상품이 존재하지 않습니다.');
    }

    // 해당 product를 등록한 사용자와 일치하는지 검증
    if (userId !== productEnrollUserId) {
      throw new ErrorHandler(ErrorCode.FORBIDDEN, 'user', '해당 상품을 삭제할 권한이 없습니다.');
    }

    // 삭제
    await this.productRepository.deleteProduct(productId);
  }
}
