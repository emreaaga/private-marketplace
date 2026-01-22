import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { companiesTable } from './companies';
import { relations } from 'drizzle-orm';
import { flightsTable } from './flights';
import { ordersTable } from './orders';

export const dispatchStatusEnum = pgEnum('dispatch_status', [
  'draft',
  'ready',
  'in_flight',
  'arrived',
  'closed',
]);

export const dispatchesTable = pgTable('dispatches', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  company_id: integer('company_id')
    .notNull()
    .references(() => companiesTable.id),

  flight_id: integer('flight_id').references(() => flightsTable.id),

  from_country: varchar('from_country', { length: 2 }).notNull(),
  to_country: varchar('to_country', { length: 2 }).notNull(),

  status: dispatchStatusEnum().notNull().default('draft'),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const dispatchesRelations = relations(
  dispatchesTable,
  ({ one, many }) => ({
    company: one(companiesTable, {
      fields: [dispatchesTable.company_id],
      references: [companiesTable.id],
    }),

    flight: one(flightsTable, {
      fields: [dispatchesTable.flight_id],
      references: [flightsTable.id],
    }),

    orders: many(ordersTable),
  }),
);
