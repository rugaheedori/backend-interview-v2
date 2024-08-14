// todo testcode
// import { Test, TestingModule } from '@nestjs/testing';
// import { AuthService } from './auth.service';
// import { CacheModule } from '@nestjs/common';
// import { JwtModule, JwtService } from '@nestjs/jwt';
// import { MyLogger } from '../utils/logger';
// import { ConfigService } from '@nestjs/config';
// import { CacheService } from '../cache/cache.service';
// import { ErrorHandler } from '../utils/exception/error.exception';
// import { ErrorCode, ErrorDetailCode } from '../utils/exception/error.type';

// describe('AuthService', () => {
//   let service: AuthService;
//   let jwtService: JwtService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         AuthService,
//         ConfigService,
//         { provide: CacheService, useValue: CacheModule },
//         { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
//         MyLogger,
//       ],
//     }).compile();

//     service = module.get<AuthService>(AuthService);
//     jwtService = module.get<JwtService>(JwtService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('토큰 재발급', () => {
//     it('refreshToken이 만료된 경우 401 error 발생', async () => {
//       try {
//         jest.spyOn(jwtService, 'verifyAsync').mockImplementation(() => {
//           throw new Error('Something went wrong');
//         });

//         jwtService.v
//         // service.createTokenByRefreshToken(
//         //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImU1NTg2ZGUzLTgxNDItNGVmZS1iOWFiLTA1ZTlmYmUyZDUwMyIsImlhdCI6MTcyMzU2NjA4NSwiZXhwIjoxNzI2MTU4MDk1fQ.gYIAkhanZ6NfdzROwgxO75Uuv2DtXYKx-HQ1KPw8m_Y',
//         // );
//       } catch (err) {
//         console.log(err);
//         expect(err).toBeInstanceOf(ErrorHandler);
//         expect(err).toHaveProperty('status', 401);
//         expect(err).toHaveProperty('code', ErrorCode.UNAUTHORIZED);
//         expect(err).toHaveProperty('details.code', ErrorDetailCode.EXPIRED);
//         expect(err).toHaveProperty('details.field', 'password');
//         expect(err).toHaveProperty('message', '비밀번호가 일치하지 않습니다.');
//       }
//     });

//     it('JsonWebTokenError이 발생하는 경우는 뭐가 있지..?', () => {});

//     it('서버에 저장된 refreshToken의 정보가 없는 경우 400 error', () => {});

//     it('서버에 저장된 refreshToken이 일치하지 않는 경우 401 error 발생', () => {});
//   });
// });
