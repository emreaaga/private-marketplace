import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from 'src/common/services/token.service';
import type { Request } from 'express';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;
    if (!authHeader) throw new UnauthorizedException('No authorization header');

    const [, token] = authHeader.split(' ');
    if (!token) throw new UnauthorizedException('Invalid token format');

    try {
      const payload = await this.tokenService.verifyAccessToken(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
