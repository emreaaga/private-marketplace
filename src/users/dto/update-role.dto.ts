import { IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  COMPANY_OWNER = 'company_owner',
}

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
