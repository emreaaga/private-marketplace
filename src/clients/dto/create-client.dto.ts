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
import { CountryCityDistrictDto } from 'src/common/dto';
import {
  normalizeCapitalized,
  normalizeTrimmed,
} from 'src/common/utils/string.utils';

export class CreateClientDto extends CountryCityDistrictDto {
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
