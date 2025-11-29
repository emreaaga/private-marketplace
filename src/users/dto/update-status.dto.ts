import { IsEnum } from 'class-validator';

enum UserStatus {
  ACTIVE = 'active',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

export class UpdateStatusDto {
  @IsEnum(UserStatus)
  status: UserStatus;
}
