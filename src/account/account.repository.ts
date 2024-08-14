import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';
import { SignUpInfo, UserInfo } from './type';

@Injectable()
export class AccountRepository {
  constructor(private dbService: DbService, private logger: MyLogger) {}

  async checkDuplicateEmail(email: string): Promise<boolean> {
    try {
      const result = await this.dbService.user.findUnique({
        select: { id: true },
        where: {
          email,
        },
      });

      return result?.id != null;
    } catch (err) {
      this.logger.error(`checkDuplicateEmail: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(signUpInfo: SignUpInfo): Promise<void> {
    try {
      await this.dbService.user.create({
        data: signUpInfo,
      });
    } catch (err) {
      this.logger.error(`createUser: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async checkSignedUser(email: string): Promise<UserInfo | null> {
    try {
      const userInfo = await this.dbService.user.findUnique({
        select: {
          id: true,
          password: true,
        },
        where: {
          email,
        },
      });

      return userInfo;
    } catch (err) {
      console.error(`checkSignedUser: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }
}
