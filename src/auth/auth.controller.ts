import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IssueToken } from './dto/issue-token.dto';
import { AccessTokenInfo, UserTokenInfo } from './type';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  // 새 token 발급 요청
  @Post('issue/token')
  async issueToken(
    @Body() data: IssueToken,
  ): Promise<{ success: boolean, token_info: UserTokenInfo | AccessTokenInfo }> {
    const tokenInfo = await this.authService.createTokenByRefreshToken(data.refresh_token);

    return { success: true, token_info: tokenInfo };
  }
}
