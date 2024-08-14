import { Injectable } from '@nestjs/common';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { EnrollProduct } from './dto/enroll-product.dto';
import { GetProductList } from './dto/get-product-list.dto';
import { ModifyProduct } from './dto/modify-product.dto';
import { ProductRepository } from './product.repository';
import {
  CursorOption,
  FilterOption,
  OrderOption,
  ProductInfo,
  ResProductList,
  SortType,
} from './type';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}
  setProductListOrder(orderType: SortType): OrderOption {
    switch (orderType) {
      case SortType.review:
        return {
          Review: {
            _count: 'desc',
          },
        };
      case SortType.max_price:
        return {
          price: 'desc',
        };
      case SortType.min_price:
        return {
          price: 'asc',
        };
      case SortType.newest:
        return {
          created_time: 'desc',
        };
      case SortType.like:
      default:
        return {
          Like: {
            _count: 'desc',
          },
        };
    }
  }

  setProductListFilter(data: GetProductList): FilterOption {
    const filterOption = {} as FilterOption;

    if (data.brand != null) {
      filterOption.brand = data.brand;
    }

    if (data.min_price != null) {
      filterOption.price = { gte: data.min_price };
    }

    if (data.max_price != null) {
      filterOption.price = { ...filterOption.price, lte: data.max_price };
    }

    if (data.size != null) {
      filterOption.size = data.size;
    }

    if (data.color != null) {
      filterOption.color = data.color;
    }

    return filterOption;
  }

  async getProductList(data: GetProductList): Promise<Array<ResProductList>> {
    if (data.min_price != null && data.max_price != null && data.min_price > data.max_price) {
      throw new ErrorHandler(
        ErrorCode.INVALID_ARGUMENT,
        'price',
        '최소값은 최대값보다 클 수 없습니다.',
      );
    }

    // db에서 작업하지 않도록 여기서 filter option이랑, cursor option 정해야 함.
    const orderOption = this.setProductListOrder(data.sort);
    const filterOption = this.setProductListFilter(data);
    const cursorOption = {} as CursorOption;

    if (data.cursor != null) {
      cursorOption.cursor = { id: data.cursor };
      cursorOption.skip = 1;
    }

    const result = await this.productRepository.getProductList(
      data.limit,
      orderOption,
      filterOption,
      cursorOption,
    );

    if (result.length > 0) {
      const productInfoList = result.map((x) => {
        return {
          id: x.id,
          name: x.name,
          price: x.price,
          size: x.size,
          created_time: x.created_time,
          like_count: x._count.Like,
          review_count: x._count.Review,
        };
      });

      return productInfoList;
    }

    return [];
  }

  async getProductDetail(productId: string): Promise<ProductInfo> {
    const productInfo = await this.productRepository.getProductInfo(productId);

    if (productInfo == null) {
      throw new ErrorHandler(ErrorCode.NOT_FOUND, 'product', '해당 상품이 존재하지 않습니다.');
    }

    return productInfo;
  }

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
