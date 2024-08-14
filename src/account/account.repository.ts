import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { MyLogger } from '../utils/logger';
import { SignUpInfo } from './type';

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

      //todo 없는 경우 null 있는 경우는 id? 확인해봐야 함.
      console.log(result);
      // { id: '81a40c27-f85e-440d-89db-b5a8743bd341' }
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
}
