import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { type ServiceType, ServiceTypeValues } from './service-type';
import { type ServicePricing, ServicePricingValues } from './service-pricing';
import { Type } from 'class-transformer';

export class FindServicesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number;

  @IsOptional()
  @IsEnum(ServiceTypeValues)
  type: ServiceType;

  @IsOptional()
  @IsEnum(ServicePricingValues)
  pricing_type: ServicePricing;
}
