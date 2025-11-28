import { IsString, MinLength } from 'class-validator';
import { BaseAuthDto } from './base-auth.dto';

export class RegisterDto extends BaseAuthDto {
  @IsString()
  @MinLength(2)
  name: string;
}
