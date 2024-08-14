import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../utils/exception/error.exception';
import { ErrorCode } from '../utils/exception/error.type';
import { AccountRepository } from './account.repository';
import { SignUp } from './dto/sign-up.dto';
import { SignUpInfo } from './type';
import { SignIn } from './dto/sign-in.dto';
import { AuthService } from '../auth/auth.service';
import { UserTokenInfo } from '../auth/type';
import { MyLogger } from '../utils/logger';

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private authService: AuthService,
    private logger: MyLogger,
  ) {}

  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      return hashedPassword;
    } catch (err) {
      this.logger.error(`hashPassword: ${err.message}`);
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

  async checkPassword(password: string, hashPassword: string): Promise<boolean> {
    try {
      const isCorrect = await bcrypt.compare(password, hashPassword);

      return isCorrect;
    } catch (err) {
      this.logger.error(`checkPassword: ${err.message}`);
      throw new ErrorHandler(ErrorCode.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(data: SignIn): Promise<UserTokenInfo> {
    // 해당 email 가입 여부 조회
    const userInfo = await this.accountRepository.checkSignedUser(data.email);

    if (userInfo?.password == null) {
      throw new ErrorHandler(
        ErrorCode.UNAUTHORIZED,
        {},
        '이메일 또는 패스워드를 다시 한번 확인해주세요',
      );
    }

    const { id: userId, password: hashedPassword } = userInfo;
    // 비밀번호 일치 확인
    const isCorrect = await this.checkPassword(data.password, hashedPassword);

    if (!isCorrect) {
      throw new ErrorHandler(
        ErrorCode.UNAUTHORIZED,
        {},
        '이메일 또는 패스워드를 다시 한번 확인해주세요',
      );
    }

    const tokenInfo = await this.authService.createToken(userId);

    return tokenInfo;
  }
}
