import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  numeric,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { dispatchesTable } from './dispatches';

export const flightStatusEnum = pgEnum('flight_status', [
  'planned',
  'departed',
  'arrived',
  'closed',
]);

export const flightsTable = pgTable('flights', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  from_country: varchar('from_country', { length: 2 }).notNull(),
  from_city: varchar('from_city', { length: 3 }).notNull(),

  to_country: varchar('to_country', { length: 2 }).notNull(),
  to_city: varchar('to_city', { length: 3 }).notNull(),

  rate_per_kg: numeric('rate_per_kg', { precision: 8, scale: 2 }).notNull(),

  status: flightStatusEnum().notNull().default('planned'),

  departure_at: timestamp('departure_at', { withTimezone: false }),
  arrival_at: timestamp('arrival_at', { withTimezone: false }),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const flightsRelations = relations(flightsTable, ({ many }) => ({
  dispatches: many(dispatchesTable),
}));
