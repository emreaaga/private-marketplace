import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  numeric,
  varchar,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { shipmentsTable } from './shipments';
import { companiesTable } from './companies';
import { flightExpensesTable } from './flight_expenses';

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

  air_partner_id: integer('air_partner_id')
    .notNull()
    .references(() => companiesTable.id),

  sender_customs_id: integer('sender_customs_id')
    .notNull()
    .references(() => companiesTable.id),

  receiver_customs_id: integer('receiver_customs_id')
    .notNull()
    .references(() => companiesTable.id),

  // ставка авиапартнёра (2.2 $/кг), все цены рейса считаются за кг
  air_kg_price: numeric('air_kg_price', {
    precision: 8,
    scale: 2,
  }).notNull(),

  sender_customs_kg_price: numeric('sender_customs_kg_price', {
    precision: 8,
    scale: 2,
  }).notNull(),

  receiver_customs_kg_price: numeric('receiver_customs_kg_price', {
    precision: 8,
    scale: 2,
  }).notNull(),

  loading_at: timestamp('loading_at', { withTimezone: false }),
  departure_at: timestamp('departure_at', { withTimezone: false }),
  arrival_at: timestamp('arrival_at', { withTimezone: false }),
  unloading_at: timestamp('unloading_at', { withTimezone: false }),

  awb_number: varchar('awb_number', { length: 64 }),
  final_gross_weight_kg: numeric('final_gross_weight_kg', {
    precision: 10,
    scale: 2,
  }),

  status: flightStatusEnum().notNull().default('planned'),

  is_paid: boolean('is_paid').notNull().default(false),
  paid_at: timestamp('paid_at'),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const flightsRelations = relations(flightsTable, ({ many, one }) => ({
  shipments: many(shipmentsTable),

  airPartner: one(companiesTable, {
    fields: [flightsTable.air_partner_id],
    references: [companiesTable.id],
    relationName: 'airPartner',
  }),

  senderCustoms: one(companiesTable, {
    fields: [flightsTable.sender_customs_id],
    references: [companiesTable.id],
    relationName: 'senderCustoms',
  }),

  receiverCustoms: one(companiesTable, {
    fields: [flightsTable.receiver_customs_id],
    references: [companiesTable.id],
    relationName: 'receiverCustoms',
  }),

  expenses: many(flightExpensesTable),
}));
