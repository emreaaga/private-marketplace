import { Injectable } from '@nestjs/common';
import { count, countDistinct, desc, eq, sql } from 'drizzle-orm';
import { PaginatedResponse } from 'src/common/types';
import { calculatePagination } from 'src/common/utils/pagination.util';
import { DbService } from 'src/db/db.service';
import { ordersTable, tripsTable, tripStopsTable } from 'src/db/schema';
import { TripsQueryDto } from './dto';

@Injectable()
export class TripsRepository {
  constructor(private readonly db: DbService) {}

  async findAll(filters: TripsQueryDto): Promise<PaginatedResponse> {
    const { page } = filters;
    const limit = 10;
    const offset = (page - 1) * limit;

    const trips = await this.db.client
      .select({
        id: tripsTable.id,
        total_city: countDistinct(tripStopsTable.id).mapWith(Number),
        total_orders: countDistinct(ordersTable.id).mapWith(Number),

        total_weight: sql<string>`
              COALESCE(SUM(${ordersTable.weight_kg}) / NULLIF(COUNT(DISTINCT ${tripStopsTable.id}), 0), '0')
            `,

        total_remaining: sql<string>`
              COALESCE(SUM(${ordersTable.total_amount} - ${ordersTable.prepaid_amount}) / NULLIF(COUNT(DISTINCT ${tripStopsTable.id}), 0), '0')
            `,

        status: tripsTable.status,
        created_at: tripsTable.created_at,
      })
      .from(tripsTable)
      .innerJoin(tripStopsTable, eq(tripsTable.id, tripStopsTable.trip_id))
      .innerJoin(ordersTable, eq(tripsTable.id, ordersTable.trip_id))
      .orderBy(desc(tripsTable.created_at))
      .groupBy(tripsTable.id, tripsTable.status, tripsTable.created_at)
      .offset(offset)
      .limit(limit);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(tripsTable);

    return {
      data: trips,
      pagination: calculatePagination(page, total, limit),
    };
  }

  async create(flightId: number, companyId: number, dbOrTx = this.db.client) {
    const [data] = await dbOrTx
      .insert(tripsTable)
      .values({
        flight_id: flightId,
        company_id: companyId,
      })
      .returning({ id: tripsTable.id });

    return data;
  }
}
