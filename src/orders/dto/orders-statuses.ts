import { orderStatusEnum } from 'src/db/schema';

export type OrdersStatus = (typeof orderStatusEnum.enumValues)[number];
