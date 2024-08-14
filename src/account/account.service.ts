import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { AccountRepository } from './account.repository';
import { SignUp } from './dto/sign-up.dto';
import { SignUpInfo } from './type';

@Injectable()
export class AccountService {
  constructor(private accountRepository: AccountRepository) {}
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      return passwordHash;
    } catch (err) {
      console.error(`hashPassword: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async signUp(data: SignUp): Promise<boolean> {
    // 비밀번호 일치여부 확인
    if (data.password !== data.confirm_password) {
      throw new ErrorHandler(
        ErrorCode.INVALID_ARGUMENT,
        'password',
        '비밀번호가 일치하지 않습니다.',
      );
    }

    // email 중복 확인
    const isDuplicateEmail = await this.accountRepository.checkDuplicateEmail(data.email);

    if (isDuplicateEmail) {
      throw new ErrorHandler(
        ErrorCode.DUPLICATED,
        'email',
        '해당 이메일로 가입된 정보가 존재합니다.',
      );
    }

    // 비밀번호 암호화
    const hashedPassword = await this.hashPassword(data.password);
    const signUpInfo: SignUpInfo = {
      email: data.email,
      password: hashedPassword,
    };

    // 신규 유저 생성
    await this.accountRepository.createUser(signUpInfo);

    return true;
  }
}
