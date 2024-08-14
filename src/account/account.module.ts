import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { MyLogger } from '../utils/logger';
import { AccountController } from './account.controller';
import { AccountRepository } from './account.repository';
import { AccountService } from './account.service';

@Module({
  imports: [DbModule, AuthModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, MyLogger],
})
export class AccountModule {}
