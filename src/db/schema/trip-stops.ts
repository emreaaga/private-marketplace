import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, timestamp } from 'drizzle-orm/pg-core';
import { branchesTable } from './branches';
import { tripsTable } from './trips';

export const tripStopStatusEnum = pgEnum('trip_stop_status', [
  'created', // Только добавили
  'pending', // Машина в пути к этой точке
  'delivered', // Груз передан в филиал
]);

export const tripStopsTable = pgTable('trip_stops', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  trip_id: integer('trip_id')
    .notNull()
    .references(() => tripsTable.id),

  branch_id: integer('branch_id')
    .notNull()
    .references(() => branchesTable.id),

  stop_order: integer('stop_order').notNull(),

  status: tripStopStatusEnum().notNull().default('created'),

  arrived_at: timestamp('arrived_at'),
});

export const tripStopsRelations = relations(tripStopsTable, ({ one }) => ({
  trip: one(tripsTable, {
    fields: [tripStopsTable.trip_id],
    references: [tripsTable.id],
  }),
  branch: one(branchesTable, {
    fields: [tripStopsTable.branch_id],
    references: [branchesTable.id],
  }),
}));
