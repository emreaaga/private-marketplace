import { JwtAccessToken } from 'src/auth/dto/types';

export interface AccessTokenPayload extends JwtAccessToken {
  iat?: number;
  exp?: number;
}
