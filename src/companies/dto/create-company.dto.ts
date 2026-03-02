import { IsEnum, IsString, Length } from 'class-validator';
import { type CompanyType, CompanyTypeValues } from './company-type';

export class CreateCompanyDto {
  @IsString({ message: 'Имя: только буквы' })
  @Length(2, 100)
  name: string;

  @IsEnum(CompanyTypeValues, { message: 'Выберите корректный тип компании' })
  type: CompanyType;

  @Length(2, 2, { message: 'Страна: код из 2 букв' })
  country: string;

  @Length(3, 3, { message: 'Город: 3 буквы латиницей' })
  city: string;
}
