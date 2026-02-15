import {
  IsString,
  IsInt,
  Length,
  Min,
  IsOptional,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { normalizeTrimmed } from 'src/common/utils/string.utils';

const MONEY_RE = /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/;
const ITEM_NAME_RE = /^[\p{L}\d][\p{L}\d\s._\-(),/+:]{0,99}$/u;

export class CreateOrderItem {
  @IsOptional()
  @IsString()
  category?: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Length(1, 100)
  @Matches(ITEM_NAME_RE, { message: 'name contains invalid characters' })
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(MONEY_RE, {
    message: 'unit_price must be a positive amount with up to 2 decimals',
  })
  unit_price: string;
}
