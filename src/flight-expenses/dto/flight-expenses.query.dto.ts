import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto';

export class FlightExpensesQueryDto extends PaginationQueryDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  flight_id: number;
}
