import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { TokenService } from 'src/common/services/token.service';
import { AccessTokenPayload } from 'src/common/types/auth.types';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AccessTokenPayload }>();

    const accessToken = request.cookies?.['access_token'] as string | undefined;

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found in cookies');
    }

    try {
      const payload = (await this.tokenService.verifyAccessToken(
        accessToken,
      )) as AccessTokenPayload;

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
