import { companyTypeEnum } from 'src/db/schema';

const _AllCompanyTypeValues = companyTypeEnum.enumValues;

export type CompanyType = Exclude<
  (typeof _AllCompanyTypeValues)[number],
  'platform'
>;

export const CompanyTypeValues = _AllCompanyTypeValues.filter(
  (t): t is CompanyType => t !== 'platform',
);
