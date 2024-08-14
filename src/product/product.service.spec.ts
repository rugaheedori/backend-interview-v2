import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from '../db/db.module';
import { DbService } from '../db/db.service';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode, ErrorDetailCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { Size } from './type';

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        ProductRepository,
        { provide: DbService, useValue: DbModule },
        MyLogger,
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('상품 등록하기', () => {
    const userId = 'e5586de3-8142-4efe-b9ab-05e9fbe2d503';
    const productInfo = {
      name: '오버핏 반팔 티셔츠',
      description: '넉넉한 사이즈의 반팔, 핏 보장',
      brand: 'nike',
      price: 50000,
      size: Size.XL,
      color: 'black',
    };

    it('같은 사용자가 등록한 같은 상품이 있다면 (이름 & 브랜드 & 색상 & 사이즈가 모두 동일) 409 error 발생', async () => {
      try {
        jest.spyOn(repository, 'checkEnrolledProduct').mockResolvedValueOnce(true);
        await service.enrollProduct(userId, productInfo);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 409);
        expect(err).toHaveProperty('code', ErrorCode.DUPLICATED);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.DUPLICATED);
        expect(err).toHaveProperty('details.field', 'product');
        expect(err).toHaveProperty('message', '이미 등록된 상품입니다.');
      }
    });
  });

  describe('상품 수정하기', () => {
    const userId = 'e5586de3-8142-4efe-b9ab-05e9fbe2d503';
    const productInfo = {
      product_id: 'da8e4a88-6659-4e94-8fae-9391fe9e3efc',
      name: '오버핏 반팔 티셔츠',
      description: '넉넉한 사이즈의 반팔, 핏 보장',
      brand: 'nike',
      price: 50000,
      size: Size.XL,
      color: 'black',
    };

    it('등록되어 있는 상품이 아니라면 404 error 발생', async () => {
      try {
        jest.spyOn(repository, 'getProductEnrollUserId').mockResolvedValueOnce(null);
        await service.modifyProduct(userId, productInfo);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 404);
        expect(err).toHaveProperty('code', ErrorCode.NOT_FOUND);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.NOT_FOUND);
        expect(err).toHaveProperty('details.field', 'product');
        expect(err).toHaveProperty('message', '해당 상품이 존재하지 않습니다.');
      }
    });

    it('상품 등록한 유저와 수정하려는 유저가 다른 경우 403 error 발생', async () => {
      try {
        const productEnrollUserId = 'dd3b019d-7b07-5e79-80d9-5db6f51f2b9b';

        jest.spyOn(repository, 'getProductEnrollUserId').mockResolvedValueOnce(productEnrollUserId);
        await service.modifyProduct(userId, productInfo);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 403);
        expect(err).toHaveProperty('code', ErrorCode.FORBIDDEN);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.FORBIDDEN);
        expect(err).toHaveProperty('details.field', 'user');
        expect(err).toHaveProperty('message', '해당 상품을 수정할 권한이 없습니다.');
      }
    });
  });

  describe('상품 삭제하기', () => {
    const userId = 'e5586de3-8142-4efe-b9ab-05e9fbe2d503';
    const productId = 'da8e4a88-6659-4e94-8fae-9391fe9e3efc';

    it('등록되어 있는 상품이 아니라면 404 error 발생', async () => {
      try {
        jest.spyOn(repository, 'getProductEnrollUserId').mockResolvedValueOnce(null);
        await service.removeProduct(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 404);
        expect(err).toHaveProperty('code', ErrorCode.NOT_FOUND);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.NOT_FOUND);
        expect(err).toHaveProperty('details.field', 'product');
        expect(err).toHaveProperty('message', '해당 상품이 존재하지 않습니다.');
      }
    });

    it('상품 등록한 유저와 삭제하려는 유저가 다른 경우 403 error 발생', async () => {
      try {
        const productEnrollUserId = 'dd3b019d-7b07-5e79-80d9-5db6f51f2b9b';

        jest.spyOn(repository, 'getProductEnrollUserId').mockResolvedValueOnce(productEnrollUserId);
        await service.removeProduct(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 403);
        expect(err).toHaveProperty('code', ErrorCode.FORBIDDEN);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.FORBIDDEN);
        expect(err).toHaveProperty('details.field', 'user');
        expect(err).toHaveProperty('message', '해당 상품을 삭제할 권한이 없습니다.');
      }
    });
  });
});
