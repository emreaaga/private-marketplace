import { IsString, IsEnum, Length } from 'class-validator';
import { CompanyType } from './company-type.enum';

export class CreateCompanyDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEnum(CompanyType)
  type: CompanyType;

  @IsString()
  @Length(2, 2)
  country: string;

  @IsString()
  @Length(3, 3)
  city: string;
}
