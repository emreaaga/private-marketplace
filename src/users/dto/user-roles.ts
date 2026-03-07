import { userRoleEnum } from 'src/db/schema';

const _AllUserRoleValues = userRoleEnum.enumValues;

//Типы с admin
export type AllUserRoles = (typeof _AllUserRoleValues)[number];

export type UserRoles = Exclude<(typeof _AllUserRoleValues)[number], 'admin'>;

export const UserRoleValues = _AllUserRoleValues.filter(
  (t): t is UserRoles => t !== 'admin',
);
