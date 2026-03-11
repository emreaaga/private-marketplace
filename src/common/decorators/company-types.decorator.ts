import { SetMetadata } from '@nestjs/common';
import { type AllCompanyType } from 'src/companies/dto/company-type';

export const CompanyTypes = (...types: AllCompanyType[]) =>
  SetMetadata('companyTypes', types);
