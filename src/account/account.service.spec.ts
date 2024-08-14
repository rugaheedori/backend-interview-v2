import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';
import { DbService } from '../db/db.service';
import { DbModule } from '../db/db.module';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode, ErrorDetailCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';

describe('AccountService', () => {
  let service: AccountService;
  let repository: AccountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        AccountRepository,
        { provide: DbService, useValue: DbModule },
        MyLogger,
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get<AccountRepository>(AccountRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('회원가입 진행', () => {
    const testData = {
      email: 'test@gmail.com',
      password: 'Test123!',
      confirm_password: 'Test123!',
    };

    beforeEach(() => {
      jest.spyOn(repository, 'checkDuplicateEmail').mockResolvedValue(false);
      jest.spyOn(repository, 'createUser').mockResolvedValueOnce(null);
    });

    it('회원가입 진행 시 비밀번호가 불일치 하면 400 error 발생', async () => {
      try {
        await service.signUp({...testData, confirm_password: 'test123!'});
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 400);
        expect(err).toHaveProperty('code', ErrorCode.INVALID_ARGUMENT);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.INVALID);
        expect(err).toHaveProperty('details.field', 'password');
        expect(err).toHaveProperty('message', '비밀번호가 일치하지 않습니다.');
      }
    });

    it('회원가입 진행 시 이미 가입된 이메일이라면 409 error 발생', async () => {
      try {
        jest.spyOn(repository, 'checkDuplicateEmail').mockResolvedValueOnce(true);
        await service.signUp(testData);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 409);
        expect(err).toHaveProperty('code', ErrorCode.DUPLICATED);
        expect(err).toHaveProperty('details.code', ErrorDetailCode.DUPLICATED);
        expect(err).toHaveProperty('details.field', 'email');
        expect(err).toHaveProperty('message', '해당 이메일로 가입된 정보가 존재합니다.');
      }
    });

    it('회원가입 성공시 success return', async () => {
      expect(await service.signUp(testData)).toEqual(true);
    });
  });
});
