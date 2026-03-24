import { Transform } from 'class-transformer';
import { IsString, Length, Matches } from 'class-validator';
import {
  normalizeTrimmed,
  normalizeUpperTrimmed,
} from 'src/common/utils/string.utils';

const PASSPORT_NUMBER_RE = /^[A-Z0-9]+$/;
const NATIONAL_ID_RE = /^\d+$/;

export class CreateClientPassportDto {
  @Transform(({ value }) => normalizeUpperTrimmed(value))
  @IsString()
  @Length(5, 50)
  @Matches(PASSPORT_NUMBER_RE, {
    message: 'passport_number must contain only latin letters and digits',
  })
  passport_number: string;

  @Transform(({ value }) => normalizeTrimmed(value))
  @IsString()
  @Length(7, 20, { message: 'national_id must be between 7 and 20 characters' })
  @Matches(NATIONAL_ID_RE, {
    message: 'national_id must contain only digits',
  })
  national_id: string;
}
