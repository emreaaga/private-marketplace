import { flightExpenseTypeEnum } from 'src/db/schema/flight-expenses';

export type FlightExpensesType =
  (typeof flightExpenseTypeEnum.enumValues)[number];

export const flightExpenseTypeValues = flightExpenseTypeEnum.enumValues;
