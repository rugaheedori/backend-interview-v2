import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { DbModule } from '../db/db.module';
import { AccountRepository } from './account.repository';
import { MyLogger } from '../utils/logger';

@Module({
  imports: [DbModule],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository, MyLogger]
})
export class AccountModule {}
