import { IsInt, IsNotEmpty, IsNumberString, Min } from 'class-validator';

export class UpdateFlightShipmentDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsNumberString()
  @IsNotEmpty()
  total_weight_kg: string;
}
