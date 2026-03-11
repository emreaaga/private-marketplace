import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AccessTokenPayload } from 'src/common/types';
import { type AllCompanyType } from 'src/companies/dto/company-type';
import { type AllUserRoles } from 'src/users/dto';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AllUserRoles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );
    const requiredTypes = this.reflector.getAllAndOverride<AllCompanyType[]>(
      'companyTypes',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredTypes) return true;

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AccessTokenPayload }>();

    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден в запросе');
    }

    const hasRole = requiredRoles ? requiredRoles.includes(user.role) : true;

    const hasType = requiredTypes ? requiredTypes.includes(user.ctype) : true;

    if (!hasRole || !hasType) {
      throw new ForbiddenException('У вас недостаточно прав');
    }

    return true;
  }
}
