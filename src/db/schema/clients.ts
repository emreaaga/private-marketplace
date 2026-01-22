import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ordersTable } from './orders';

export const clientsTable = pgTable('clients', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  first_name: varchar('first_name', { length: 255 }).notNull(),
  last_name: varchar('last_name', { length: 255 }).notNull(),

  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }).notNull(),

  country: varchar('country', { length: 2 }).notNull(),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const clientsRelations = relations(clientsTable, ({ many }) => ({
  sentOrders: many(ordersTable, {
    relationName: 'sender',
  }),

  receivedOrders: many(ordersTable, {
    relationName: 'receiver',
  }),
}));
