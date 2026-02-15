import { Type, Transform } from 'class-transformer';
import {
  IsString,
  Length,
  ArrayNotEmpty,
  ValidateNested,
  Matches,
  IsOptional,
} from 'class-validator';
import { CreateClientPassportDto } from 'src/client-passports/dto/create-passport.dto';
import {
  normalizeTrimmed,
  normalizeUpperTrimmed,
  normalizeCapitalized,
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
    message: 'name must contain letters only',
  })
  name: string;

  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(PERSON_NAME_RE, {
    message: 'surname must contain letters only',
  })
  surname: string;

  @Transform(({ value }) => normalizeUpperTrimmed(value))
  @IsString()
  @Matches(COUNTRY_ISO2_RE, {
    message: 'country must be ISO 3166-1 alpha-2 (e.g. TR, RU, US)',
  })
  country: string;

  @Transform(({ value }) => normalizeUpperTrimmed(value))
  @IsString()
  @Matches(CITY_CODE_RE, {
    message: 'city must be exactly 3 latin letters (e.g. IST, TAS)',
  })
  city: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Length(1, 50)
  @Matches(DISTRICT_ONE_WORD_RE, {
    message: 'district must be one word with latin letters only (e.g. fatih)',
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
    message: 'phone_country_code must be 1-4 digits (e.g. 90)',
  })
  phone_country_code: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Matches(PHONE_NUMBER_RE, {
    message: 'phone_number must contain digits only (5-20 length)',
  })
  phone_number: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateClientPassportDto)
  passports: CreateClientPassportDto[];
}
