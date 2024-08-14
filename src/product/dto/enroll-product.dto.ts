import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { Size } from '../type';

export class EnrollProduct {
  @IsString()
  @IsNotEmpty()
  @Length(1, 20, { message: '20자 이하로 작성해주세요.' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: '100자 이하로 작성해주세요.' })
  description: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20, { message: '20자 이하로 작성해주세요.' })
  brand: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @Min(1, { message: '최소 금액은 1원 이상입니다.' })
  @Max(100000000, { message: '최대 금액은 천만원 이하입니다.' })
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Size)
  size: Size;

  @IsString()
  @IsNotEmpty()
  color: string;
}
