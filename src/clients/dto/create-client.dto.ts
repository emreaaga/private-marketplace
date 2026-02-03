import { Type } from 'class-transformer';
import {
  IsString,
  Length,
  ArrayNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateClientPassportDto } from 'src/client-passports/dto/create-passport.dto';

export class CreateClientDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 100)
  surname: string;

  @IsString()
  @Length(2, 2)
  country: string;

  @IsString()
  @Length(3)
  city: string;

  @IsString()
  @Length(1, 50)
  district: string;

  @IsString()
  @Length(0, 255)
  address_line: string;

  @IsString()
  @Length(1, 5)
  phone_country_code: string;

  @IsString()
  @Length(5, 20)
  phone_number: string;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateClientPassportDto)
  passports: CreateClientPassportDto[];
}
