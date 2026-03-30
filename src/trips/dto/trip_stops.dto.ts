import { Type } from 'class-transformer';
import { IsDefined, IsInt, Min } from 'class-validator';

export class TripStopDto {
  @IsInt()
  @Min(1)
  @IsDefined()
  @Type(() => Number)
  branch_id: number;

  @IsInt()
  @Min(1)
  @IsDefined()
  @Type(() => Number)
  stop_order: number;
}
