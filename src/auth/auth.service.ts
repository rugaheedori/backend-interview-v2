import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { CacheService } from '../cache/cache.service';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode, ErrorDetailCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';
import { AccessTokenInfo, RefreshTokenInfo, UserTokenInfo } from './type';

const REFRESH_TOKEN = 'refresh-token:';

@Injectable()
export class AuthService {
  private ACCESSTOKEN_EXPIRE: number;
  private REFRESHTOKEN_EXPIRE: number;
  private ACCESSTOKEN_SECRET: string;
  private REFRESHTOKEN_SECRET: string;

  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
    private jwtService: JwtService,
    private logger: MyLogger,
  ) {
    this.ACCESSTOKEN_EXPIRE = Number(this.configService.get('ACCESSTOKEN_EXPIRE'));
    this.REFRESHTOKEN_EXPIRE = Number(this.configService.get('REFRESHTOKEN_EXPIRE'));
    this.ACCESSTOKEN_SECRET = this.configService.get('ACCESSTOKEN_SECRET');
    this.REFRESHTOKEN_SECRET = this.configService.get('REFRESHTOKEN_SECRET');
  }

  async createAccessToken(userId: string): Promise<string> {
    try {
      const accessToken = await this.jwtService.signAsync(
        { id: userId },
        {
          secret: this.ACCESSTOKEN_SECRET,
          expiresIn: this.ACCESSTOKEN_EXPIRE + 10, // 10초 여유
        },
      );

      return accessToken;
    } catch (err) {
      this.logger.error(`createAccessToken: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async createRefreshToken(userId: string): Promise<string> {
    try {
      const refreshToken = await this.jwtService.signAsync(
        { id: userId },
        {
          secret: this.REFRESHTOKEN_SECRET,
          expiresIn: this.REFRESHTOKEN_EXPIRE + 10, // 10초 여유
        },
      );

      return refreshToken;
    } catch (err) {
      this.logger.error(`createRefreshToken: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async createToken(userId: string): Promise<UserTokenInfo> {
    const accessToken = await this.createAccessToken(userId);
    const refreshToken = await this.createRefreshToken(userId);
    const key = REFRESH_TOKEN + userId;

    await this.cacheService.set(key, refreshToken, this.REFRESHTOKEN_EXPIRE + 10); // 10초 여유

    const currentTime = dayjs();
    const tokenInfo: UserTokenInfo = {
      token_type: 'Bearer',
      access_token: accessToken,
      access_token_expire_time: currentTime.add(this.ACCESSTOKEN_EXPIRE, 'seconds'),
      refresh_token: refreshToken,
      refresh_token_expires_time: currentTime.add(this.REFRESHTOKEN_EXPIRE, 'seconds'),
    };

    return tokenInfo;
  }

  async verifyRefreshToken(refreshToekn: string): Promise<RefreshTokenInfo> {
    try {
      const verfiedUserInfo = await this.jwtService.verifyAsync(refreshToekn, {
        secret: this.REFRESHTOKEN_SECRET,
      });

      return verfiedUserInfo as RefreshTokenInfo;
    } catch (err) {
      this.logger.error(`verifyRefreshToken: ${err.message}`);

      if (err instanceof TokenExpiredError) {
        throw new ErrorHandler(
          ErrorCode.UNAUTHORIZED,
          { token: ErrorDetailCode.EXPIRED },
          '만료된 토큰입니다. 다시 로그인해주세요.',
        );
      } else if (err instanceof JsonWebTokenError) {
        throw new ErrorHandler(
          ErrorCode.INTERNAL_SERVER_ERROR,
          { token: ErrorDetailCode.INVALID },
          '유효하지 않은 토큰입니다. 다시 로그인해주세요.',
        );
      }
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async createTokenByRefreshToken(refreshToken: string): Promise<AccessTokenInfo | UserTokenInfo> {
    // refreshToken 유효성 확인
    const { id: userId, exp } = await this.verifyRefreshToken(refreshToken);
    const key = REFRESH_TOKEN + userId;
    const storedRefreshToken = await this.cacheService.get(key);

    // 서버내 해당 refreshToken 저장 여부 확인
    if (storedRefreshToken == null || storedRefreshToken !== refreshToken) {
      throw new ErrorHandler(
        ErrorCode.UNAUTHORIZED,
        { token: ErrorDetailCode.EXPIRED },
        '만료된 토큰입니다. 다시 로그인해주세요.',
      );
    }

    // refreshToken의 만료 시간이 한 시간 이하인 경우 accessToken & refreshToken 발급
    if (dayjs(exp * 1000).diff(dayjs()) > 60 * 60 * 1000) {
      const accessToken = await this.createAccessToken(userId);
      const result: AccessTokenInfo = {
        token_type: 'Bearer',
        access_token: accessToken,
        access_token_expire_time: dayjs().add(this.ACCESSTOKEN_EXPIRE, 'seconds'),
      };

      return result;
    } else {
      return await this.createToken(userId);
    }
  }
}
