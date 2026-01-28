import { pricingTypeEnum } from 'src/db/schema';

export const ServicePricingValues = pricingTypeEnum.enumValues;
export type ServicePricing = (typeof ServicePricingValues)[number];
