import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { REGEX } from 'src/common/constants/regex.constants';
import { normalizeLowerTrimmed } from 'src/common/utils/string.utils';
import { type CompanyType, CompanyTypeValues } from './company-type';

export class CompaniesLookupQueryDto {
  @IsOptional()
  @IsEnum(CompanyTypeValues)
  type?: CompanyType;

  @IsOptional()
  @Transform(({ value }) => normalizeLowerTrimmed(value))
  @IsString()
  @Matches(REGEX.COUNTRY_ISO, {
    message: 'Страна: код из 2 букв',
  })
  country: string;
}
