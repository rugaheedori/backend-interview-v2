import { Test, TestingModule } from '@nestjs/testing';
import { DbModule } from '../db/db.module';
import { DbService } from '../db/db.service';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode, ErrorDetailCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';
import { LikeRepository } from './like.repository';
import { LikeService } from './like.service';

describe('LikeService', () => {
  let service: LikeService;
  let repository: LikeRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        LikeRepository,
        { provide: DbService, useValue: DbModule },
        MyLogger,
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
    repository = module.get<LikeRepository>(LikeRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('상품 좋아요 등록', () => {
    const userId = 'e5586de3-8142-4efe-b9ab-05e9fbe2d503';
    const productId = 'da8e4a88-6659-4e94-8fae-9391fe9e3efc';

    it('해당 상품이 존재하지 않는 경우 404 error 발생', async () => {
      try {
        jest.spyOn(repository, 'isEnrolledProduct').mockResolvedValueOnce(false);
        await service.like(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 404);
        expect(err).toHaveProperty('code', ErrorCode.NOT_FOUND);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.NOT_FOUND);
        expect(err).toHaveProperty('details.field', 'product');
        expect(err).toHaveProperty('message', '해당 상품이 존재하지 않습니다.');
      }
    });

    it('이미 좋아요 누른 경우 409 error 발생', async () => {
      try {
        jest.spyOn(repository, 'isEnrolledProduct').mockResolvedValueOnce(true);
        jest.spyOn(repository, 'isLiked').mockResolvedValueOnce(true);
        await service.like(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 409);
        expect(err).toHaveProperty('code', ErrorCode.DUPLICATED);
        expect(err).toHaveProperty('message', '이미 해당 상품에 좋아요를 눌렀습니다.');
      }
    });
  });

  describe('상품 좋아요 철회', () => {
    const userId = 'e5586de3-8142-4efe-b9ab-05e9fbe2d503';
    const productId = 'da8e4a88-6659-4e94-8fae-9391fe9e3efc';

    it('해당 상품이 존재하지 않는 경우 404 error 발생', async () => {
      try {
        jest.spyOn(repository, 'isEnrolledProduct').mockResolvedValueOnce(false);
        await service.unLike(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 404);
        expect(err).toHaveProperty('code', ErrorCode.NOT_FOUND);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.NOT_FOUND);
        expect(err).toHaveProperty('details.field', 'product');
        expect(err).toHaveProperty('message', '해당 상품이 존재하지 않습니다.');
      }
    });

    it('좋아요를 누른 적이 없는 경우 400 error 발생', async () => {
      try {
        jest.spyOn(repository, 'isEnrolledProduct').mockResolvedValueOnce(true);
        jest.spyOn(repository, 'isLiked').mockResolvedValueOnce(false);
        await service.unLike(userId, productId);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 400);
        expect(err).toHaveProperty('code', ErrorCode.BAD_REQUEST);
        expect(err).toHaveProperty('message', '좋아요를 누른 상품이 아닙니다.');
      }
    });
  });
});
