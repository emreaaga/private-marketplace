import type { JwtAccessToken } from '@/auth/dto/types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtAccessToken;
    }
  }
}
