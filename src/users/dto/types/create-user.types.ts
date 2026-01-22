import { UserRole } from '../update-role.dto';

export interface CreateUser {
  company_id: number;

  name: string;
  surname: string;
  email: string;

  country: string;
  city: string;
  district: string;

  password: string;

  address_line: string;

  phone_country_code: string;
  phone_number: string;

  role: UserRole;
}
