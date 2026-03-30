import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { companiesTable } from './companies';
import { ordersTable } from './orders';
import { tripStopsTable } from './trip-stops';
import { usersTable } from './users';

export const branchesTable = pgTable('branches', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  company_id: integer('company_id')
    .notNull()
    .references(() => companiesTable.id),

  name: varchar('name', { length: 255 }).notNull(),
  country: varchar('country', { length: 2 }).notNull(),
  city: varchar('city', { length: 3 }).notNull(),

  is_main: boolean('is_main').notNull().default(false),
  is_active: boolean('is_active').notNull().default(true),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const branchesRelations = relations(branchesTable, ({ one, many }) => ({
  company: one(companiesTable, {
    fields: [branchesTable.company_id],
    references: [companiesTable.id],
  }),
  users: many(usersTable),
  orders: many(ordersTable),
  tripStops: many(tripStopsTable),
}));
