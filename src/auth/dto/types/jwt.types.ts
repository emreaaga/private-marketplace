import type { Request } from 'express';
import { type AllUserRoles } from 'src/users/dto';

export interface JwtRefreshToken {
  sub: number;
}

export interface JwtAccessToken extends JwtRefreshToken {
  role: AllUserRoles;
  cid: number;
}

export type LoginTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface RefreshTokenRequest extends Request {
  cookies: Record<string, string>;
}
