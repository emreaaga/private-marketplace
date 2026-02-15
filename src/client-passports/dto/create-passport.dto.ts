import { IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeUpperTrimmed } from 'src/common/utils/string.utils';

const PASSPORT_NUMBER_RE = /^[A-Z0-9]+$/;

export class CreateClientPassportDto {
  @Transform(({ value }) => normalizeUpperTrimmed(value))
  @IsString()
  @Length(5, 50)
  @Matches(PASSPORT_NUMBER_RE, {
    message:
      'passport_number must contain only latin letters and digits (no spaces)',
  })
  passport_number: string;
}
