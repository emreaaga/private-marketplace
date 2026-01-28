import { IsInt, IsString, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShipmentDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  company_id: number;

  @IsString()
  @Length(2, 2)
  from_country: string;

  @IsString()
  @Length(2, 2)
  to_country: string;
}
