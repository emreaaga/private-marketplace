import {
  integer,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ordersTable } from './orders';
import { clientPassportsTable } from './client_passports';

export const clientStatusEnum = pgEnum('client_status', [
  'active',
  'blocked',
  'pending',
]);

export const clientsTable = pgTable('clients', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  name: varchar('name', { length: 255 }).notNull(),
  surname: varchar('surname', { length: 255 }).notNull(),

  email: varchar('email', { length: 255 }),
  status: clientStatusEnum().notNull().default('active'),

  country: varchar('country', { length: 2 }).notNull(),
  city: varchar('city', { length: 3 }).notNull(),
  district: varchar('district', { length: 50 }).notNull(),

  address_line: varchar('address_line', { length: 255 }),

  phone_country_code: varchar('phone_country_code', { length: 5 }).notNull(),
  phone_number: varchar('phone_number', { length: 20 }).notNull(),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const clientsRelations = relations(clientsTable, ({ many }) => ({
  passports: many(clientPassportsTable),

  sentOrders: many(ordersTable, {
    relationName: 'sender',
  }),
  receivedOrders: many(ordersTable, {
    relationName: 'receiver',
  }),
}));
