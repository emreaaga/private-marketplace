import { IsInt, IsString, Matches, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { normalizeTrimmed } from 'src/common/utils/string.utils';

const DECIMAL_2_RE = /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/;

export class OrderSummaryDto {
  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(DECIMAL_2_RE, {
    message: 'deposit must be a non-negative decimal with up to 2 decimals',
  })
  deposit: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(DECIMAL_2_RE, {
    message: 'extra_fee must be a non-negative decimal with up to 2 decimals',
  })
  extra_fee: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(DECIMAL_2_RE, {
    message: 'rate_per_kg must be a non-negative decimal with up to 2 decimals',
  })
  rate_per_kg: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  shipment_id: number;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(DECIMAL_2_RE, {
    message: 'weight_kg must be a non-negative decimal with up to 2 decimals',
  })
  weight_kg: string;
}
