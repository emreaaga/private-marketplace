import { PaginationQueryDto } from 'src/common/dto';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class OrdersQueryDto extends PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @Min(1)
  shipment_id: number;
}
