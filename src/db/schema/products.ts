import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const productsTable = pgTable('products', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  seller_id: integer('seller_id')
    .notNull()
    .references(() => usersTable.id),

  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),

  unit: varchar('unit', { length: 50 }).notNull(),
  quantity: integer('quantity').notNull(),

  comment: varchar('comment', { length: 255 }),
  photo_url: varchar('photo_url', { length: 255 }),
  is_public: boolean('is_public').notNull().default(false),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});
