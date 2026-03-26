import { flightStatusEnum } from 'src/db/schema';

export type FlightStatuses = (typeof flightStatusEnum.enumValues)[number];
