import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import {
  ShipmentsStatusValues,
  type ShipmentsStatus,
} from './shipments-status';

export class ShipmentsQueryDto {
  @IsOptional()
  @IsEnum(ShipmentsStatusValues)
  status?: ShipmentsStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  company_id?: number;
}
