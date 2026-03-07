import { type AllUserRoles } from 'src/users/dto';

export interface AccessTokenPayload {
  sub: number;
  role: AllUserRoles;
  cid: number;
  iat?: number;
  exp?: number;
}
