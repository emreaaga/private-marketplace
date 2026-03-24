import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumberString,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { CountryCityDto } from 'src/common/dto';
import { UpdateFlightShipmentDto } from './update-shipment.dto';

export class UpdateFlightDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CountryCityDto)
  departure_location?: CountryCityDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CountryCityDto)
  arrival_location?: CountryCityDto;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  air_partner_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  sender_customs_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  receiver_customs_id?: number;

  @IsOptional()
  @IsNumberString()
  air_kg_price?: string;

  @IsOptional()
  @IsNumberString()
  awb_number?: string | null;

  @IsOptional()
  @IsNumberString()
  final_gross_weight_kg?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  loading_at?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  departure_at?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  arrival_at?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  unloading_at?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateFlightShipmentDto)
  shipments?: UpdateFlightShipmentDto[];
}
