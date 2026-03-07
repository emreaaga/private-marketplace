import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { REGEX } from 'src/common/constants/regex.constants';
import { CountryCityDistrictDto } from 'src/common/dto';
import {
  normalizeCapitalized,
  normalizeTrimmed,
} from 'src/common/utils/string.utils';
import { type UserRoles, UserRoleValues } from './user-roles';

export class UpdateUserDto {
  @IsOptional()
  @IsIn(UserRoleValues, { message: 'Некорректный роль' })
  role?: UserRoles;

  @IsOptional()
  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(REGEX.PERSON_NAME, { message: 'Имя: только буквы' })
  name?: string;

  @IsOptional()
  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(REGEX.PERSON_NAME, { message: 'Фамилия: только буквы' })
  surname?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email' })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(8, 100, { message: 'Пароль должен быть не менее 8 символов' })
  password?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CountryCityDistrictDto)
  location?: CountryCityDistrictDto;

  @IsOptional()
  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Length(0, 255)
  address_line?: string;

  @IsOptional()
  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(REGEX.PHONE_COUNTRY_CODE, {
    message: 'Код страны: 1-4 цифры без символов',
  })
  phone_code?: string;

  @IsOptional()
  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(REGEX.PHONE_NUMBER, { message: 'Номер: 5-20 цифр' })
  phone_number?: string;
}
