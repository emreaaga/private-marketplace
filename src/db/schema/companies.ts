import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { usersTable } from './users';
import { relations } from 'drizzle-orm';
import { servicesTable } from './services';
import { shipmentsTable } from './shipments';
import { flightsTable } from './flights';

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
  users: many(usersTable),
  services: many(servicesTable),
  shipments: many(shipmentsTable),
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
