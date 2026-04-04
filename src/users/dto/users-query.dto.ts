import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto';
import { type UserRoles, UserRoleValues } from './user-roles';

export class UsersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(UserRoleValues)
  role?: UserRoles;
}
