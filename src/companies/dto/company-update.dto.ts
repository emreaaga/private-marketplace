import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { REGEX } from 'src/common/constants/regex.constants';
import { CountryCityDto } from 'src/common/dto';
import { normalizeCapitalized } from 'src/common/utils/string.utils';
import { type CompanyType, CompanyTypeValues } from './company-type';

export class CompanyUpdateDto {
  @IsOptional()
  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(REGEX.PERSON_NAME, { message: 'Название: только буквы' })
  name?: string;

  @IsOptional()
  @IsIn(CompanyTypeValues, { message: 'Некорректный тип фирмы	' })
  type?: CompanyType;

  @IsOptional()
  @ValidateNested()
  @Type(() => CountryCityDto)
  location?: CountryCityDto;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
