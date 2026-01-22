import { Type } from 'class-transformer';
import { IsInt, Min, IsEnum, IsNumber } from 'class-validator';

export enum ServiceType {
  FLIGHT = 'flight',
  CUSTOMS = 'customs',
  DELIVERY = 'delivery',
  MARKETING = 'marketing',
  PENALTY = 'penalty',
}

export enum ServicePrice {
  PER_KG = 'per_kg',
  FIXED = 'fixed',
  PER_ITEM = 'per_item',
}

export class CreateServiceDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  company_id: number;

  @IsEnum(ServiceType)
  type: ServiceType;

  @IsEnum(ServicePrice)
  pricing_type: ServicePrice;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;
}
