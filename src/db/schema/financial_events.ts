import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  numeric,
  text,
} from 'drizzle-orm/pg-core';

import { ordersTable } from './orders';
import { shipmentsTable } from './shipments';
import { flightsTable } from './flights';

export const financialEventTypeEnum = pgEnum('financial_event_type', [
  'payment', // оплата от клиента
  'prepayment', // предоплата
  'additional', // доплата
  'penalty', // штраф
  'adjustment', // корректировка
  'refund', // возврат
]);

export const financialEventsTable = pgTable('financial_events', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  /** к чему относится */
  order_id: integer('order_id').references(() => ordersTable.id),
  shipment_id: integer('shipment_id').references(() => shipmentsTable.id),
  flight_id: integer('flight_id').references(() => flightsTable.id),

  type: financialEventTypeEnum().notNull(),

  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  // + деньги пришли
  // - деньги ушли

  description: text('description'),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});
