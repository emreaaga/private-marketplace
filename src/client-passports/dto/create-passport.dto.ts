import { IsString, Length } from 'class-validator';

export class CreateClientPassportDto {
  @IsString()
  @Length(5, 50)
  passport_number: string;
}
