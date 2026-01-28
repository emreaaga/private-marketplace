import { shipmentsStatusEnum } from 'src/db/schema';

export const ShipmentsStatusValues = shipmentsStatusEnum.enumValues;

export type ShipmentsStatus = (typeof ShipmentsStatusValues)[number];
