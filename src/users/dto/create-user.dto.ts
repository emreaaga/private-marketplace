import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

import { REGEX } from 'src/common/constants/regex.constants';
import { CountryCityDistrictDto } from 'src/common/dto';
import {
  normalizeCapitalized,
  normalizeTrimmed,
} from 'src/common/utils/string.utils';
import { UserRoleValues, type UserRoles } from './user-roles';

export class CreateUserDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  company_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  branch_id: number;

  @IsString()
  @Transform(({ value }) => normalizeCapitalized(value))
  @Length(2, 100)
  @Matches(REGEX.PERSON_NAME, { message: 'Имя: только буквы' })
  name: string;

  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(REGEX.PERSON_NAME, { message: 'Фамилия: только буквы' })
  surname: string;

  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @ValidateNested()
  @Type(() => CountryCityDistrictDto)
  location: CountryCityDistrictDto;

  @IsString()
  @Length(8, 100)
  password: string;

  @IsOptional()
  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Length(0, 255)
  address_line: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(REGEX.PHONE_COUNTRY_CODE, {
    message: 'Код страны: 1-4 цифры без символов',
  })
  phone_country_code: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(REGEX.PHONE_NUMBER, { message: 'Номер: 5-20 цифр' })
  phone_number: string;

  @IsIn(UserRoleValues)
  role: UserRoles;
}
