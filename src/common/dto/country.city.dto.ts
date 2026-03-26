import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import { REGEX } from 'src/common/constants/regex.constants';
import { normalizeLowerTrimmed } from 'src/common/utils/string.utils';

export class CountryDto {
  @Transform(({ value }) => normalizeLowerTrimmed(value))
  @IsString()
  @Matches(REGEX.COUNTRY_ISO, {
    message: 'Страна: код из 2 букв',
  })
  country: string;
}

export class CountryCityDto extends CountryDto {
  @Transform(({ value }) => normalizeLowerTrimmed(value))
  @IsString()
  @Matches(REGEX.CITY_ISO, {
    message: 'Город: 3 буквы латиницей',
  })
  city: string;
}

export class CountryCityDistrictDto extends CountryCityDto {
  @Transform(({ value }) => normalizeLowerTrimmed(value))
  @IsString()
  @Length(1, 50)
  district: string;
}
