import { relations } from 'drizzle-orm';
import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { companiesTable } from './companies';
import { ordersTable } from './orders';
import { tripStopsTable } from './trip_stops';

export const tripStatusEnum = pgEnum('trip_status', [
  'created', // Запланирован (идет погрузка)
  'on_way', // В пути (машина выехала)
  'completed', // Завершен (все точки пройдены)
]);

export const tripsTable = pgTable('trips', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  company_id: integer('company_id')
    .notNull()
    .references(() => companiesTable.id),

  vehicle_info: varchar('vehicle_info', { length: 255 }).notNull(),
  driver_info: varchar('driver_info', { length: 255 }).notNull(),

  status: tripStatusEnum().notNull().default('created'),

  departure_at: timestamp('departure_at'), // Когда выехал из Ташкента
  arrival_at: timestamp('arrival_at'), // Когда разгрузил последнюю точку

  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const tripsRelations = relations(tripsTable, ({ many, one }) => ({
  stops: many(tripStopsTable),
  orders: many(ordersTable),
  company: one(companiesTable, {
    fields: [tripsTable.company_id],
    references: [companiesTable.id],
  }),
}));
