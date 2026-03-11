import { SetMetadata } from '@nestjs/common';
import { AllUserRoles } from 'src/users/dto';

export const Roles = (...roles: AllUserRoles[]) => SetMetadata('roles', roles);
