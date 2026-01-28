import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { companiesTable } from './companies';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('role', ['admin', 'company_owner']);
export const userStatusEnum = pgEnum('status', [
  'active',
  'blocked',
  'pending',
]);

export const usersTable = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  company_id: integer('company_id')
    .notNull()
    .references(() => companiesTable.id),

  name: varchar('name', { length: 100 }).notNull(),
  surname: varchar('surname', { length: 100 }).notNull(),

  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),

  role: userRoleEnum().notNull().default('company_owner'),
  status: userStatusEnum().notNull().default('active'),

  country: varchar('country', { length: 2 }).notNull(),
  city: varchar('city', { length: 3 }).notNull(),
  district: varchar('district', { length: 50 }).notNull(),

  address_line: varchar('address_line', { length: 255 }),

  phone_country_code: varchar('phone_country_code', { length: 5 }).notNull(),
  phone_number: varchar('phone_number', { length: 20 }).notNull(),

  created_at: timestamp('created_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: false })
    .defaultNow()
    .notNull(),
});

export const usersRelations = relations(usersTable, ({ one }) => ({
  company: one(companiesTable, {
    fields: [usersTable.company_id],
    references: [companiesTable.id],
  }),
}));
