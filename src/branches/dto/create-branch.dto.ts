import { Transform, Type } from 'class-transformer';
import {
  IsDefined,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from 'class-validator';
import { REGEX } from 'src/common/constants/regex.constants';
import { CountryCityDto } from 'src/common/dto';
import { normalizeCapitalized } from 'src/common/utils/string.utils';

export class CreateBranchDto {
  @Transform(({ value }) => normalizeCapitalized(value))
  @IsString()
  @Length(2, 100)
  @Matches(REGEX.ENTITY_NAME, {
    message: 'Имя: только буквы',
  })
  name: string;

  @ValidateNested()
  @Type(() => CountryCityDto)
  @IsDefined()
  location: CountryCityDto;
}
