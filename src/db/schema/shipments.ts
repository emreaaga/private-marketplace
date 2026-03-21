import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm';
import { companiesTable } from './companies';
import { financialEventsTable } from './financial-events';
import { flightsTable } from './flights';
import { ordersTable } from './orders';

export const shipmentsStatusEnum = pgEnum('shipment_status', [
  'draft',
  'ready', // все заказы собраны
  'in_flight', // физически летит
  'arrived', // прибыла в страну назначения
  'closed', // полностью обработана
]);

export const shipmentsTable = pgTable(
  'shipments',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    internal_number: integer('internal_number').notNull().default(0),

    company_id: integer('company_id')
      .notNull()
      .references(() => companiesTable.id),

    flight_id: integer('flight_id').references(() => flightsTable.id),

    from_country: varchar('from_country', { length: 2 }).notNull(),
    to_country: varchar('to_country', { length: 2 }).notNull(),

    status: shipmentsStatusEnum().notNull().default('draft'),

    created_at: timestamp('created_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('company_shipment_number_idx').on(
      table.company_id,
      table.internal_number,
    ),
  ],
);

export const shipmentRelations = relations(shipmentsTable, ({ one, many }) => ({
  shipment: one(companiesTable, {
    fields: [shipmentsTable.company_id],
    references: [companiesTable.id],
  }),

  flight: one(flightsTable, {
    fields: [shipmentsTable.flight_id],
    references: [flightsTable.id],
  }),

  orders: many(ordersTable),

  financialEvents: many(financialEventsTable),
}));
