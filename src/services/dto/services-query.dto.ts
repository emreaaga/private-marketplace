import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { type ServiceType, ServiceTypeValues } from './service-type';
import { type ServicePricing, ServicePricingValues } from './service-pricing';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto';

export class ServicesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number;

  @IsOptional()
  @IsEnum(ServiceTypeValues)
  type?: ServiceType;

  @IsOptional()
  @IsEnum(ServicePricingValues)
  pricing_type?: ServicePricing;
}
