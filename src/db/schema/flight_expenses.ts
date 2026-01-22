import {
  integer,
  pgEnum,
  pgTable,
  numeric,
  timestamp,
  text,
} from 'drizzle-orm/pg-core';

import { flightsTable } from './flights';

export const flightExpenseTypeEnum = pgEnum('flight_expense_type', [
  'aircraft', // самолёт / авиапартнёр
  'customs', // таможня
  'handling', // обработка
  'other',
]);

export const flightExpensesTable = pgTable('flight_expenses', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  flight_id: integer('flight_id')
    .notNull()
    .references(() => flightsTable.id),

  type: flightExpenseTypeEnum().notNull(),

  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),

  description: text('description'),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});
