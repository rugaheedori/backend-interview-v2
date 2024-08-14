import { Dayjs } from 'dayjs';
import { Request } from 'express';

export class AccessTokenInfo {
  token_type: 'Bearer';
  access_token: string;
  access_token_expire_time: Dayjs;
}

export class UserTokenInfo extends AccessTokenInfo {
  refresh_token: string;
  refresh_token_expires_time: Dayjs;
}

export class RefreshTokenInfo {
  id: string;
  iat: number;
  exp: number;
}

export class UserReq extends Request {
  user?: {
    id: string;
    accessToken: string;
  };
}
