import { Test, TestingModule } from '@nestjs/testing';
import * as dayjs from 'dayjs';
import { AuthService } from '../auth/auth.service';
import { UserTokenInfo } from '../auth/type';
import { DbModule } from '../db/db.module';
import { DbService } from '../db/db.service';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode, ErrorDetailCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

const tokenInfo: UserTokenInfo = {
  token_type: 'Bearer',
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1NTg2ZGUzLTgxNDItNGVmZS1iOWFiLTA1ZTlmYmUyZDUwMyIsImlhdCI6MTcyMzU2NjA4NSwiZXhwIjoxNzIzNTY2Njk1fQ.53zpYGd_bmSHFTwfRGSc4OCJB6n5m65Hckey98Vysro',
  access_token_expire_time: dayjs('2024-08-13T16:31:25.518Z'),
  refresh_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1NTg2ZGUzLTgxNDItNGVmZS1iOWFiLTA1ZTlmYmUyZDUwMyIsImlhdCI6MTcyMzU2NjA4NSwiZXhwIjoxNzI2MTU4MDk1fQ.gYIAkhanZ6NfdzROwgxO75Uuv2DtXYKx-HQ1KPw8m_Y',
  refresh_token_expires_time: dayjs('2024-09-12T16:21:25.518Z'),
};

describe('AccountService', () => {
  let service: AccountService;
  let repository: AccountRepository;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        AccountRepository,
        { provide: DbService, useValue: DbModule },
        {
          provide: AuthService,
          useValue: {
            createToken: jest.fn().mockResolvedValue(tokenInfo),
          },
        },
        MyLogger,
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get<AccountRepository>(AccountRepository);
    authService = module.get<AuthService>(AuthService);
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
        await service.signUp({ ...testData, confirm_password: 'test123!' });
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

  describe('로그인 진행', () => {
    const testData = {
      email: 'test@gmail.com',
      password: 'Test123!',
    };

    beforeEach(() => {
      jest.spyOn(repository, 'checkSignedUser').mockResolvedValue({
        id: 'e5586de3-8142-4efe-b9ab-05e9fbe2d503',
        password: '$2b$10$rgavHA/f2dq7rC3ajd3MTelgfWlCTx/XjY7GBTK7z1ed5rlsHtguG',
      });
      jest.spyOn(repository, 'createUser').mockResolvedValueOnce(null);
    });

    it('해당 이메일로 가입된 정보가 없다면 401 error 발생', async () => {
      try {
        jest.spyOn(repository, 'checkSignedUser').mockResolvedValueOnce(null);
        await service.signIn(testData);
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 401);
        expect(err).toHaveProperty('code', ErrorCode.UNAUTHORIZED);
        expect(err).toHaveProperty('message', '이메일 또는 패스워드를 다시 한번 확인해주세요');
      }
    });

    it('비밀번호가 일치하지 않는다면 401 error 발생', async () => {
      try {
        await service.signIn({ ...testData, password: 'Wrongpassword!' });
      } catch (err) {
        expect(err).toBeInstanceOf(ErrorHandler);
        expect(err).toHaveProperty('status', 401);
        expect(err).toHaveProperty('code', ErrorCode.UNAUTHORIZED);
        expect(err).toHaveProperty('message', '이메일 또는 패스워드를 다시 한번 확인해주세요');
      }
    });

    it('정상 로그인이 되었다면 accessToekn, refreshToken 발급', async () => {
      expect(await service.signIn(testData)).toEqual(tokenInfo);
    });
  });
});
