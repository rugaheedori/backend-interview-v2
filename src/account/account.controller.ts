import { Body, Controller, Post } from '@nestjs/common';
import { UserTokenInfo } from '../auth/type';
import { AccountService } from './account.service';
import { SignIn } from './dto/sign-in.dto';
import { SignUp } from './dto/sign-up.dto';

@Controller('api/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('sign-up')
  async signUp(@Body() data: SignUp): Promise<{ success: boolean }> {
    await this.accountService.signUp(data);

    return { success: true };
  }

  @Post('sign-in')
  async signIn(@Body() data: SignIn): Promise<{ success: boolean; token_info: UserTokenInfo }> {
    const tokenInfo = await this.accountService.signIn(data);

    return { success: true, token_info: tokenInfo};
  }
}
