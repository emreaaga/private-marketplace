import { IsEnum, IsOptional } from 'class-validator';
import { type CompanyType, CompanyTypeValues } from './company-type';

export class CompaniesQueryDto {
  @IsOptional()
  @IsEnum(CompanyTypeValues)
  type?: CompanyType;
}
