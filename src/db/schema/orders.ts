import { relations } from 'drizzle-orm';
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { branchesTable } from './branches';
import { clientsTable } from './clients';
import { companiesTable } from './companies';
import { financialEventsTable } from './financial-events';
import { orderItemsTable } from './order_items';
import { servicesTable } from './services';
import { shipmentsTable } from './shipments';

export const orderStatusEnum = pgEnum('order_status', [
  'received', // принят
  'in_flight', // едет/летит
  'arrived', // в стране
  'delivered', // отдан клиенту
  'closed', // закрыт
]);

export const ordersTable = pgTable(
  'orders',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    internal_number: integer('internal_number').notNull().default(0),

    destination_branch_id: integer('destination_branch_id').references(
      () => branchesTable.id,
    ),

    company_id: integer('company_id')
      .notNull()
      .references(() => companiesTable.id),

    shipment_id: integer('shipment_id')
      .notNull()
      .references(() => shipmentsTable.id),

    sender_id: integer('sender_id')
      .notNull()
      .references(() => clientsTable.id),

    receiver_id: integer('receiver_id')
      .notNull()
      .references(() => clientsTable.id),

    service_id: integer('service_id').references(() => servicesTable.id),

    to_country: varchar('to_country', { length: 2 }).notNull(),
    to_city: varchar('to_city', { length: 3 }).notNull(),

    weight_kg: numeric('weight_kg', { precision: 8, scale: 2 }).notNull(),
    extra_fee: numeric('extra_fee', { precision: 10, scale: 2 }),

    rate_per_kg: numeric('rate_per_kg', { precision: 8, scale: 2 }).notNull(),
    subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),

    prepaid_amount: numeric('prepaid_amount', { precision: 10, scale: 2 })
      .notNull()
      .default('0'),

    total_amount: numeric('total_amount', {
      precision: 10,
      scale: 2,
    }).notNull(),

    status: orderStatusEnum().notNull().default('received'),

    created_at: timestamp('created_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex('shipment_order_number_idx').on(
      table.shipment_id,
      table.internal_number,
    ),
  ],
);

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  company: one(companiesTable, {
    fields: [ordersTable.company_id],
    references: [companiesTable.id],
  }),

  destinationBranch: one(branchesTable, {
    fields: [ordersTable.destination_branch_id],
    references: [branchesTable.id],
  }),

  shipment: one(shipmentsTable, {
    fields: [ordersTable.shipment_id],
    references: [shipmentsTable.id],
  }),

  sender: one(clientsTable, {
    fields: [ordersTable.sender_id],
    references: [clientsTable.id],
    relationName: 'sender',
  }),

  receiver: one(clientsTable, {
    fields: [ordersTable.receiver_id],
    references: [clientsTable.id],
    relationName: 'receiver',
  }),

  service: one(servicesTable, {
    fields: [ordersTable.service_id],
    references: [servicesTable.id],
  }),

  items: many(orderItemsTable),

  financialEvents: many(financialEventsTable),
}));
