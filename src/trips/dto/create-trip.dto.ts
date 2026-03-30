import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDefined,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { TripStopDto } from './trip_stops.dto';

export class CreateTripDto {
  @IsInt()
  @Min(1)
  @IsDefined()
  @Type(() => Number)
  flight_id: number;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TripStopDto)
  stops: TripStopDto[];
}
