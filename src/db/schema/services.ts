import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  numeric,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { companiesTable } from './companies';
import { ordersTable } from './orders';

export const serviceTypeEnum = pgEnum('service_type', [
  'flight',
  'customs',
  'delivery',
  'marketing',
  'penalty',
]);

export const pricingTypeEnum = pgEnum('pricing_type', [
  'per_kg',
  'fixed',
  'per_item',
]);

export const servicesTable = pgTable('services', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  company_id: integer('company_id')
    .notNull()
    .references(() => companiesTable.id),

  type: serviceTypeEnum().notNull(),
  pricing_type: pricingTypeEnum().notNull(),

  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  is_active: boolean('is_active').notNull().default(true),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const servicesRelations = relations(servicesTable, ({ one, many }) => ({
  company: one(companiesTable, {
    fields: [servicesTable.company_id],
    references: [companiesTable.id],
  }),
  orders: many(ordersTable),
}));
