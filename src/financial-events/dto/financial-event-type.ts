import { financialEventTypeEnum } from 'src/db/schema';

export const FinancialEventTypeValues = financialEventTypeEnum.enumValues;
export type FinancialEventType = (typeof FinancialEventTypeValues)[number];
