import { AccessTokenPayload } from 'src/common/types';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
