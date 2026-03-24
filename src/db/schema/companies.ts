import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { branchesTable } from './branches';
import { flightsTable } from './flights';
import { ordersTable } from './orders';
import { servicesTable } from './services';
import { shipmentsTable } from './shipments';
import { usersTable } from './users';

export const companyTypeEnum = pgEnum('company_type', [
  'platform',
  'postal',
  'air_partner',
  'customs_broker',
  'airline',
]);

export const companiesTable = pgTable('companies', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  name: varchar('name', { length: 255 }).notNull(),
  type: companyTypeEnum().notNull(),

  country: varchar('country', { length: 2 }).notNull(),
  city: varchar('city', { length: 3 }).notNull(),

  is_active: boolean('is_active').notNull().default(true),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const companiesRelations = relations(companiesTable, ({ many }) => ({
  branches: many(branchesTable),
  users: many(usersTable),
  services: many(servicesTable),
  shipments: many(shipmentsTable),
  orders: many(ordersTable),
  airPartnerFlights: many(flightsTable, {
    relationName: 'airPartner',
  }),
  senderCustomsFlights: many(flightsTable, {
    relationName: 'senderCustoms',
  }),
  receiverCustomsFlights: many(flightsTable, {
    relationName: 'receiverCustoms',
  }),
}));
