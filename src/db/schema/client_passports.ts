import {
  integer,
  pgTable,
  varchar,
  timestamp,
  pgEnum,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { clientsTable } from './clients';

export const passportStatusEnum = pgEnum('passport_status', [
  'active',
  'limit_reached',
  'expired',
  'blocked',
]);

export const clientPassportsTable = pgTable('client_passports', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  client_id: integer('client_id')
    .notNull()
    .references(() => clientsTable.id, { onDelete: 'cascade' }),

  passport_number: varchar('passport_number', { length: 50 }).notNull(),
  country: varchar('country', { length: 2 }).notNull(),

  issued_at: timestamp('issued_at', { withTimezone: false }),
  expires_at: timestamp('expires_at', { withTimezone: false }),

  status: passportStatusEnum().notNull().default('active'),

  is_primary: boolean('is_primary').notNull().default(false),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const clientPassportsRelations = relations(
  clientPassportsTable,
  ({ one }) => ({
    client: one(clientsTable, {
      fields: [clientPassportsTable.client_id],
      references: [clientsTable.id],
    }),
  }),
);
