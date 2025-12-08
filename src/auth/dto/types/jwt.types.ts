import type { Request } from 'express';

export interface JwtRefreshToken {
  sub: number;
}

export interface JwtAccessToken extends JwtRefreshToken {
  role: string;
}

export type LoginTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface RefreshTokenRequest extends Request {
  cookies: Record<string, string>;
}
