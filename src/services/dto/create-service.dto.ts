import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, Matches, Min } from 'class-validator';
import { normalizeTrimmed } from 'src/common/utils/string.utils';
import { type ServicePricing, ServicePricingValues } from './service-pricing';
import { type ServiceType, ServiceTypeValues } from './service-type';

const DECIMAL_2_RE = /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/;

export class CreateServiceDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  company_id: number;

  @IsEnum(ServiceTypeValues)
  type: ServiceType;

  @IsEnum(ServicePricingValues)
  pricing_type: ServicePricing;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(DECIMAL_2_RE, {
    message: 'price must be a non-negative decimal with up to 2 decimals',
  })
  price: string;
}
