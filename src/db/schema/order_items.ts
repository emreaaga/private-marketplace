import {
  integer,
  pgEnum,
  pgTable,
  numeric,
  varchar,
} from 'drizzle-orm/pg-core';

import { ordersTable } from './orders';
import { relations } from 'drizzle-orm';

export const orderItemCategoryEnum = pgEnum('order_item_category', [
  'clothes',
  'electronics',
]);

export const orderItemsTable = pgTable('order_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  order_id: integer('order_id')
    .notNull()
    .references(() => ordersTable.id),

  name: varchar('name', { length: 255 }).notNull(),
  category: orderItemCategoryEnum().notNull(),

  quantity: integer('quantity').notNull(),
  declared_value: numeric('declared_value', { precision: 10, scale: 2 }),
});

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.order_id],
    references: [ordersTable.id],
  }),
}));
