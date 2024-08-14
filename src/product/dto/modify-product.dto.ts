import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { Size } from '../type';

export class ModifyProduct {
  @IsUUID()
  @IsNotEmpty()
  product_id: string;

  @IsString()
  @Length(1, 20, { message: '20자 이하로 작성해주세요.' })
  name: string;

  @IsString()
  @Length(1, 100, { message: '100자 이하로 작성해주세요.' })
  description: string;

  @IsString()
  @Length(1, 20, { message: '20자 이하로 작성해주세요.' })
  brand: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1, { message: '최소 금액은 1원 이상입니다.' })
  @Max(100000000, { message: '최대 금액은 천만원 이하입니다.' })
  price: number;

  @IsString()
  @IsEnum(Size)
  size: Size;

  @IsString()
  @IsOptional()
  color: string;
}
