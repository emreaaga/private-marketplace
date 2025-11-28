import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const sellerClientsStatusEnum = pgEnum('seller_client_status', [
  'pending',
  'approved',
  'rejected',
]);

export const sellerClientsTable = pgTable(
  'seller_client',
  {
    seller_id: integer('seller_id')
      .notNull()
      .references(() => usersTable.id),
    client_id: integer('client_id')
      .notNull()
      .references(() => usersTable.id),
    status: sellerClientsStatusEnum('status').notNull().default('pending'),

    created_at: timestamp('created_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
    updated_at: timestamp('updated_at', { withTimezone: false })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.seller_id, table.client_id] }),
  }),
);
