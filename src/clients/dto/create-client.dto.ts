import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { CreateClientPassportDto } from 'src/client-passports/dto/create-passport.dto';
import { REGEX } from 'src/common/constants/regex.constants';
import {
  normalizeCapitalized,
  normalizeTrimmed,
  normalizeUpperTrimmed,
} from 'src/common/utils/string.utils';

export class CreateClientDto {
  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(REGEX.PERSON_NAME, {
    message: 'Имя: только буквы',
  })
  name: string;

  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(REGEX.PERSON_NAME, {
    message: 'Фамилия: только буквы',
  })
  surname: string;

  @Transform(({ value }) => normalizeUpperTrimmed(value))
  @IsString()
  @Matches(REGEX.COUNTRY_ISO2, {
    message: 'Страна: код из 2 букв (TR, UZ)',
  })
  country: string;

  @Transform(({ value }) => normalizeUpperTrimmed(value))
  @IsString()
  @Matches(REGEX.CITY_CODE, {
    message: 'Город: 3 буквы латиницей (TAS)',
  })
  city: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Length(1, 50)
  @Matches(REGEX.DISTRICT_ONE_WORD, {
    message: 'Район: только буквы',
  })
  district: string;

  @IsOptional()
  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Length(1, 255)
  address_line?: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(REGEX.PHONE_COUNTRY_CODE, {
    message: 'Код страны: 1-4 цифры',
  })
  phone_country_code: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(REGEX.PHONE_NUMBER, {
    message: 'Номер: 5-20 цифр',
  })
  phone_number: string;

  @ValidateNested()
  @Type(() => CreateClientPassportDto)
  identity_document: CreateClientPassportDto;
}
