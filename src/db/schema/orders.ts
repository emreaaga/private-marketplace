import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

import { clientsTable } from './clients';
import { shipmentsTable } from './shipments';
import { servicesTable } from './services';
import { orderItemsTable } from './order_items';

export const orderStatusEnum = pgEnum('order_status', [
  'received', // принят
  'in_flight', // едет/летит
  'arrived', // в стране
  'delivered', // отдан клиенту
  'closed', // закрыт
]);

export const ordersTable = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  shipment_id: integer('shipment_id')
    .notNull()
    .references(() => shipmentsTable.id),

  sender_id: integer('sender_id')
    .notNull()
    .references(() => clientsTable.id),

  receiver_id: integer('receiver_id')
    .notNull()
    .references(() => clientsTable.id),

  service_id: integer('service_id')
    .notNull()
    .references(() => servicesTable.id),

  weight_kg: numeric('weight_kg', { precision: 8, scale: 2 }).notNull(),

  rate_per_kg: numeric('rate_per_kg', { precision: 8, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),

  prepaid_amount: numeric('prepaid_amount', { precision: 10, scale: 2 })
    .notNull()
    .default('0'),

  total_amount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),

  status: orderStatusEnum().notNull().default('received'),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  shipment: one(shipmentsTable, {
    fields: [ordersTable.shipment_id],
    references: [shipmentsTable.id],
  }),

  sender: one(clientsTable, {
    fields: [ordersTable.sender_id],
    references: [clientsTable.id],
  }),

  receiver: one(clientsTable, {
    fields: [ordersTable.receiver_id],
    references: [clientsTable.id],
  }),

  service: one(servicesTable, {
    fields: [ordersTable.service_id],
    references: [servicesTable.id],
  }),

  items: many(orderItemsTable),
}));
