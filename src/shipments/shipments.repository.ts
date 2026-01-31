import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { shipmentsTable, companiesTable, ordersTable } from 'src/db/schema';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { and, eq, sql, type SQL } from 'drizzle-orm';
import { ShipmentsQueryDto } from './dto/shipments-query.dto';

@Injectable()
export class ShipmentsRepository {
  constructor(private readonly db: DbService) {}

  async findAll(filters: ShipmentsQueryDto) {
    const { status, company_id, flight_id } = filters;

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
      );

    return data;
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
