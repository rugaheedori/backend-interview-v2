import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';
import { Size, SortType } from '../type';

class Pagination {
  @IsUUID()
  @IsOptional()
  cursor?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  limit = 100;
}

// todo 이거 다 array여야 하는 거 아님...?
export class GetProductList extends Pagination {
  // filter options
  @IsString()
  @IsOptional()
  @Length(1, 20, { message: '20자 이하로 작성해주세요.' })
  brand?: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @Min(1, { message: '최소 금액은 1원 이상입니다.' })
  @Max(100000000, { message: '최대 금액은 천만원 이하입니다.' })
  min_price?: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @Min(1, { message: '최소 금액은 1원 이상입니다.' })
  @Max(100000000, { message: '최대 금액은 천만원 이하입니다.' })
  max_price?: number;

  @IsString()
  @IsEnum(Size)
  @IsOptional()
  size?: Size;

  @IsString()
  @IsOptional()
  color?: string;

  // sort options
  @IsEnum(SortType)
  @IsOptional()
  sort = SortType.like;
}
