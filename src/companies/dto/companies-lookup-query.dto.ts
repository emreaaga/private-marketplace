import { IsEnum, IsOptional } from 'class-validator';
import { type CompanyType, CompanyTypeValues } from './company-type';

export class CompaniesLookupQueryDto {
  @IsOptional()
  @IsEnum(CompanyTypeValues)
  type?: CompanyType;
}
