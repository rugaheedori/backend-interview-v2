import { Dayjs } from 'dayjs';

export class AccessTokenInfo {
  token_type: 'Bearer';
  access_token: string;
  access_token_expire_time: Dayjs;
}

export class UserTokenInfo extends AccessTokenInfo {
  refresh_token: string;
  refresh_token_expires_time: Dayjs;
}
