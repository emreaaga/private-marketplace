import { IsEnum } from 'class-validator';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
