import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', ['admin', 'user', 'manager']);
export const statusEnum = pgEnum('status', ['active', 'blocked', 'pending']);

export const usersTable = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),

  role: roleEnum().notNull().default('user'),
  status: statusEnum().notNull().default('pending'),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});
