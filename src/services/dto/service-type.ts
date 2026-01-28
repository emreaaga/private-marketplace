import { serviceTypeEnum } from 'src/db/schema';

export const ServiceTypeValues = serviceTypeEnum.enumValues;
export type ServiceType = (typeof ServiceTypeValues)[number];
