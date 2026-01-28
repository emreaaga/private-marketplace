import { companyTypeEnum } from 'src/db/schema';

export const CompanyTypeValues = companyTypeEnum.enumValues;

export type CompanyType = (typeof CompanyTypeValues)[number];
