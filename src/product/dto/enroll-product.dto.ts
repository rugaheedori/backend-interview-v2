import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';
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
  @Length(1, 20)
  brand: string;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @Min(0, { message: '최소 금액은 1원 이상입니다.' })
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Size)
  size: Size;

  @IsString()
  @IsNotEmpty()
  color: string;
}
