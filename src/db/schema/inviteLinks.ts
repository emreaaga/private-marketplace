import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { usersTable } from './users';

export const inviteLinksTable = pgTable('invite_links', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  seller_id: integer('seller_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  code: varchar('code', { length: 255 }).notNull().unique(),

  expires_at: timestamp('expires_at', { withTimezone: false }),
  max_uses: integer('max_uses').notNull(),
  used_count: integer('used_count').notNull().default(0),
  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});
