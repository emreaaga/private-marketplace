import { IsString, IsEnum, Length } from 'class-validator';
import { type CompanyType, CompanyTypeValues } from './company-type';

export class CreateCompanyDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEnum(CompanyTypeValues)
  type: CompanyType;

  @IsString()
  @Length(2, 2)
  country: string;

  @IsString()
  @Length(3, 3)
  city: string;
}
