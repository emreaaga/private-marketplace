import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { CreateClientPassportDto } from 'src/client-passports/dto/create-passport.dto';
import {
  normalizeCapitalized,
  normalizeTrimmed,
  normalizeUpperTrimmed,
} from 'src/common/utils/string.utils';

const PERSON_NAME_RE = /^[\p{L}]+(?:[- '][\p{L}]+)*$/u;
const COUNTRY_ISO2_RE = /^[A-Z]{2}$/;
const PHONE_COUNTRY_CODE_RE = /^\d{1,4}$/;
const PHONE_NUMBER_RE = /^\d{5,20}$/;
const CITY_CODE_RE = /^[A-Z]{3}$/;
const DISTRICT_ONE_WORD_RE = /^[A-Za-z]+$/;

export class CreateClientDto {
  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(PERSON_NAME_RE, {
    message: 'Имя: только буквы',
  })
  name: string;

  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(PERSON_NAME_RE, {
    message: 'Фамилия: только буквы',
  })
  surname: string;

  @Transform(({ value }) => normalizeUpperTrimmed(value))
  @IsString()
  @Matches(COUNTRY_ISO2_RE, {
    message: 'Страна: код из 2 букв (TR, UZ)',
  })
  country: string;

  @Transform(({ value }) => normalizeUpperTrimmed(value))
  @IsString()
  @Matches(CITY_CODE_RE, {
    message: 'Город: 3 буквы латиницей (TAS)',
  })
  city: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Length(1, 50)
  @Matches(DISTRICT_ONE_WORD_RE, {
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
  @Matches(PHONE_COUNTRY_CODE_RE, {
    message: 'Код страны: 1-4 цифры',
  })
  phone_country_code: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(PHONE_NUMBER_RE, {
    message: 'Номер: 5-20 цифр',
  })
  phone_number: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateClientPassportDto)
  passports: CreateClientPassportDto[];
}
