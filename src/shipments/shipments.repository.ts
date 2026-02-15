import { Injectable } from '@nestjs/common';
import { and, eq, sql, type SQL, desc, count } from 'drizzle-orm';
import { ShipmentsQueryDto, CreateShipmentDto } from './dto';
import { shipmentsTable, companiesTable, ordersTable } from 'src/db/schema';
import { DbService } from 'src/db/db.service';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class ShipmentsRepository {
  constructor(private readonly db: DbService) {}

  async findAll(filters: ShipmentsQueryDto): Promise<PaginatedResponse> {
    const { status, company_id, flight_id, page } = filters;
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [];

    if (status) {
      whereConditions.push(eq(shipmentsTable.status, status));
    }

    if (company_id) {
      whereConditions.push(eq(shipmentsTable.company_id, company_id));
    }

    if (flight_id) {
      whereConditions.push(eq(shipmentsTable.flight_id, flight_id));
    }

    const data = await this.db.client
      .select({
        id: shipmentsTable.id,
        company_name: companiesTable.name,
        flight_id: shipmentsTable.flight_id,
        route: sql<string>`
        upper(${shipmentsTable.from_country}) || ' → ' || upper(${shipmentsTable.to_country})`,

        orders_count: sql<number>`count(${ordersTable.id})`,
        total_weight_kg: sql<number>`coalesce(sum(${ordersTable.weight_kg}), 0)`,
        status: shipmentsTable.status,
        created_at: shipmentsTable.created_at,
      })
      .from(shipmentsTable)
      .leftJoin(
        companiesTable,
        eq(shipmentsTable.company_id, companiesTable.id),
      )
      .leftJoin(ordersTable, eq(ordersTable.shipment_id, shipmentsTable.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .groupBy(
        shipmentsTable.id,
        companiesTable.name,
        shipmentsTable.flight_id,
        shipmentsTable.from_country,
        shipmentsTable.to_country,
        shipmentsTable.status,
        shipmentsTable.created_at,
      )
      .orderBy(desc(shipmentsTable.created_at), desc(shipmentsTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(shipmentsTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number) {
    const shipment = await this.db.client
      .select({
        id: shipmentsTable.id,
        company_id: shipmentsTable.company_id,
        flight_id: shipmentsTable.flight_id,
        route: sql<string>`
        upper(${shipmentsTable.from_country}) || ' → ' || upper(${shipmentsTable.to_country})`,
        status: shipmentsTable.status,
        created_at: shipmentsTable.created_at,
      })
      .from(shipmentsTable)
      .where(eq(shipmentsTable.id, id));

    return shipment;
  }

  async create(dto: CreateShipmentDto) {
    await this.db.client.insert(shipmentsTable).values(dto);
  }
}
