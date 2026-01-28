import { IsString, Length, IsNotEmpty } from 'class-validator';

export class CountryCityDto {
  @IsString()
  @Length(2, 2)
  @IsNotEmpty()
  country: string;

  @IsString()
  @Length(3, 3)
  @IsNotEmpty()
  city: string;
}
