import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class SignUp {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // 영어 대소문자+ 숫자 + 특수기호 9자리 이상 12자리 이하
  @Matches(RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?!.*[가-힣]).{9,12}$/), {
    message: '비밀번호 형식이 잘못 되었습니다.',
  })
  @IsNotEmpty()
  password: string;

  @Matches(RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?!.*[가-힣]).{9,12}$/), {
    message: '비밀번호 형식이 잘못 되었습니다.',
  })
  @IsNotEmpty()
  confirm_password: string;
}
