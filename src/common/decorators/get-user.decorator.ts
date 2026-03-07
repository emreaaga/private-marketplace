import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type AccessTokenPayload } from '../types';

export const User = createParamDecorator(
  (data: keyof AccessTokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{
      user?: AccessTokenPayload;
    }>();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
