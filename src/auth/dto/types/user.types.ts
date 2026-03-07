import { type AllCompanyType } from 'src/companies/dto/company-type';
import { type AllUserRoles } from 'src/users/dto';

export type CreatedUser = {
  id: number;
  email: string;
};

export type UserByEmail = {
  id: number;
  name: string;
  password: string;
  role: AllUserRoles;
  company_id: number;
  company_name: string;
  company_type: AllCompanyType;
};

export type UserById = {
  id: number;
  email: string;
  role: string;
};
