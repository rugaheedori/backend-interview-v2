import { Body, Controller, Post } from '@nestjs/common';
import { SignUp } from './dto/sign-up.dto';
import { AccountService } from './account.service';

@Controller('api/account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('sign-up')
  async signUp(@Body() data: SignUp): Promise<{ success: boolean }> {
    await this.accountService.signUp(data);

    return { success: true };
  }
}
