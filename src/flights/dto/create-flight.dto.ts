import { Type } from 'class-transformer';
import {
  IsInt,
  Min,
  IsNumberString,
  IsISO8601,
  IsNotEmpty,
  IsDefined,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CountryCityDto } from './country.city.dto';

export class CreateFlightDto {
  @ValidateNested()
  @Type(() => CountryCityDto)
  @IsDefined()
  departure_location: CountryCityDto;

  @ValidateNested()
  @Type(() => CountryCityDto)
  @IsDefined()
  arrival_location: CountryCityDto;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsDefined()
  air_partner_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsDefined()
  sender_customs_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsDefined()
  receiver_customs_id: number;

  @IsNumberString()
  @IsNotEmpty()
  air_kg_price: string;

  @IsNumberString()
  @IsNotEmpty()
  sender_customs_kg_price: string;

  @IsNumberString()
  @IsNotEmpty()
  receiver_customs_kg_price: string;

  @IsISO8601()
  @IsDefined()
  loading_at: string;

  @IsISO8601()
  @IsDefined()
  departure_at: string;

  @IsISO8601()
  @IsDefined()
  arrival_at: string;

  @IsISO8601()
  @IsDefined()
  unloading_at: string;

  @Type(() => Number)
  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayNotEmpty()
  @IsDefined()
  shipments: number[];
}
