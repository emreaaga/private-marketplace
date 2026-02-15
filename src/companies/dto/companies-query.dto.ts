import { IsEnum, IsOptional } from 'class-validator';
import { type CompanyType, CompanyTypeValues } from './company-type';
import { PaginationQueryDto } from 'src/common/dto';

export class CompaniesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(CompanyTypeValues)
  type?: CompanyType;
}
