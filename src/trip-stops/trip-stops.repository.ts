import { Injectable } from '@nestjs/common';
import { and, asc, count, eq, min } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { branchesTable, ordersTable, tripStopsTable } from 'src/db/schema';

@Injectable()
export class TripStopsRepository {
  constructor(private readonly db: DbService) {}

  async findOne(tripId: number) {
    const data = await this.db.client
      .select({
        city: branchesTable.city,
        branch_id: min(tripStopsTable.branch_id),
        stop_order: min(tripStopsTable.stop_order),
        status: tripStopsTable.status,
        // Считаем количество заказов
        orders_count: count(ordersTable.id).mapWith(Number),
      })
      .from(tripStopsTable)
      .innerJoin(branchesTable, eq(branchesTable.id, tripStopsTable.branch_id))
      // Присоединяем заказы, которые едут в этот филиал этим рейсом
      .leftJoin(
        ordersTable,
        and(
          eq(ordersTable.trip_id, tripStopsTable.trip_id),
          eq(ordersTable.destination_branch_id, tripStopsTable.branch_id),
        ),
      )
      .where(eq(tripStopsTable.trip_id, tripId))
      .groupBy(
        branchesTable.city,
        tripStopsTable.status,
        tripStopsTable.branch_id, // Добавляем branch_id в группировку для корректного подсчета
      )
      .orderBy(asc(min(tripStopsTable.stop_order)));

    return data;
  }

  async createMany(
    stops: { trip_id: number; branch_id: number; stop_order: number }[],
    dbOrTx = this.db.client,
  ) {
    await dbOrTx.insert(tripStopsTable).values(stops);
  }
}
