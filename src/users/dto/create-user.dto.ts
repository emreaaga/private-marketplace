import { IsEnum, IsInt, IsString, Length, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { UserRole } from './update-role.dto';

export class CreateUserDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  company_id: number;

  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 100)
  surname: string;

  @IsString()
  @Length(8, 100)
  email: string;

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
  @Length(8, 128)
  password: string;

  @IsString()
  @Length(0, 255)
  address_line: string;

  @IsString()
  @Length(1, 5)
  phone_country_code: string;

  @IsString()
  @Length(5, 20)
  phone_number: string;

  @IsEnum(UserRole)
  role: UserRole;
}
