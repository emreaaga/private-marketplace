import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from 'src/common/dto';

import {
  ShipmentsStatusValues,
  type ShipmentsStatus,
} from './shipments-status';

export class ShipmentsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ShipmentsStatusValues)
  status?: ShipmentsStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  flight_id?: number;
}
