import { Injectable } from '@nestjs/common';
import { and, count, desc, eq, inArray, sql, sum, type SQL } from 'drizzle-orm';
import { PaginatedResponse } from 'src/common/types';
import { calculatePagination } from 'src/common/utils/pagination.util';
import { DbService } from 'src/db/db.service';
import { DbTransaction } from 'src/db/db.types';
import { companiesTable, ordersTable, shipmentsTable } from 'src/db/schema';
import {
  CreateShipmentDto,
  ShipmentsLookupQueryDto,
  ShipmentsQueryDto,
  ShipmentsStatus,
} from './dto';

@Injectable()
export class ShipmentsRepository {
  constructor(private readonly db: DbService) {}

  async findAll(filters: ShipmentsQueryDto): Promise<PaginatedResponse> {
    const { status, flight_id, page, company_id } = filters;
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [];

    if (company_id) {
      whereConditions.push(eq(shipmentsTable.company_id, company_id));
    }

    if (status) {
      whereConditions.push(eq(shipmentsTable.status, status));
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
        upper(${shipmentsTable.from_country}) || '→' || upper(${shipmentsTable.to_country})`,

        orders_count: sql<number>`count(${ordersTable.id})`,
        total_weight_kg: sql<number>`coalesce(sum(${ordersTable.weight_kg}), 0)`,

        total_prepaid: sql<string>`coalesce(sum(${ordersTable.prepaid_amount}), '0')`,
        total_remaining: sql<string>`coalesce(sum(${ordersTable.total_amount}) - sum(${ordersTable.prepaid_amount}), '0')`,

        status: shipmentsTable.status,
        created_at: shipmentsTable.created_at,
      })
      .from(shipmentsTable)
      .innerJoin(
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

    return {
      data,
      pagination: calculatePagination(page, total, limit),
    };
  }

  async lookup(filters: ShipmentsLookupQueryDto) {
    const { status, company_id, flight_id } = filters;
    const whereConditions: SQL[] = [];

    if (status != null) {
      whereConditions.push(eq(shipmentsTable.status, status));
    }

    if (company_id != null) {
      whereConditions.push(eq(shipmentsTable.company_id, company_id));
    }

    if (flight_id != null) {
      whereConditions.push(eq(shipmentsTable.flight_id, flight_id));
    }

    const data = await this.db.client
      .select({
        id: shipmentsTable.id,
        orders_count: sql<number>`count(${ordersTable.id})`,
        total_weight_kg: sql<number>`coalesce(sum(${ordersTable.weight_kg}), 0)`,
        total_prepaid: sql<number>`coalesce(sum(${ordersTable.prepaid_amount}), 0)`,
        total_remaining: sql<number>`
              coalesce(sum(${ordersTable.total_amount}), 0)
              - coalesce(sum(${ordersTable.prepaid_amount}), 0)
            `,
      })
      .from(shipmentsTable)
      .leftJoin(ordersTable, eq(ordersTable.shipment_id, shipmentsTable.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .groupBy(shipmentsTable.id)
      .orderBy(desc(shipmentsTable.created_at), desc(shipmentsTable.id))
      .limit(10);

    return data;
  }

  async findStatusById(
    shipmentId: number,
  ): Promise<ShipmentsStatus | undefined> {
    const [row] = await this.db.client
      .select({ status: shipmentsTable.status })
      .from(shipmentsTable)
      .where(eq(shipmentsTable.id, shipmentId))
      .limit(1);

    return row?.status;
  }

  async findByFlightId(flightId: number) {
    return await this.db.client
      .select({
        id: shipmentsTable.id,
        company_id: shipmentsTable.company_id,
        company_name: companiesTable.name,
        orders_count: sql<number>`count(${ordersTable.id})`,
        total_weight_kg: sql<string>`COALESCE(SUM(${ordersTable.weight_kg}), 0)`,

        total_prepaid: sql<string>`COALESCE(SUM(${ordersTable.prepaid_amount}), 0)`,
        total_remaining: sql<string>`COALESCE(SUM(${ordersTable.total_amount} - ${ordersTable.prepaid_amount}), 0)`,
      })
      .from(shipmentsTable)
      .leftJoin(ordersTable, eq(ordersTable.shipment_id, shipmentsTable.id))
      .leftJoin(
        companiesTable,
        eq(companiesTable.id, shipmentsTable.company_id),
      )
      .where(eq(shipmentsTable.flight_id, flightId))
      .groupBy(
        shipmentsTable.id,
        companiesTable.name,
        shipmentsTable.company_id,
        shipmentsTable.status,
      );
  }

  async getStatsByFlightId(flightId: number) {
    const [result] = await this.db.client
      .select({
        total_weight: sql<string>`COALESCE(SUM(${ordersTable.weight_kg}), 0)`,
        total_revenue: sql<string>`COALESCE(SUM(${ordersTable.total_amount}), 0)`,
        total_prepaid: sql<string>`COALESCE(SUM(${ordersTable.prepaid_amount}), 0)`,
      })
      .from(ordersTable)
      .innerJoin(shipmentsTable, eq(ordersTable.shipment_id, shipmentsTable.id))
      .where(eq(shipmentsTable.flight_id, flightId));

    return result;
  }

  async findOne(id: number) {
    const shipment = await this.db.client
      .select({
        id: shipmentsTable.id,
        company_name: companiesTable.name,
        company_id: companiesTable.id,
        flight_id: shipmentsTable.flight_id,
        route: sql<string>`
        upper(${shipmentsTable.from_country}) || '→' || upper(${shipmentsTable.to_country})`,
        status: shipmentsTable.status,
        created_at: shipmentsTable.created_at,
      })
      .from(shipmentsTable)
      .leftJoin(
        companiesTable,
        eq(companiesTable.id, shipmentsTable.company_id),
      )
      .where(eq(shipmentsTable.id, id));

    return shipment;
  }

  async updateShipmentsStatus(
    shipmentIds: number[],
    flightId: number,
    shipmentStatus: ShipmentsStatus,
    tx?: DbTransaction,
  ) {
    const db = tx ?? this.db.client;
    const result = await db
      .update(shipmentsTable)
      .set({ flight_id: flightId, status: shipmentStatus })
      .where(inArray(shipmentsTable.id, shipmentIds))
      .returning({ id: shipmentsTable.id });

    return result;
  }

  async getTotalWeightByShipmentIds(shipmentIds: number[], tx?: DbTransaction) {
    const db = tx ?? this.db.client;

    const [result] = await db
      .select({
        totalWeight: sum(ordersTable.weight_kg),
      })
      .from(ordersTable)
      .where(inArray(ordersTable.shipment_id, shipmentIds));

    return Number(result?.totalWeight || 0);
  }

  async getTotalCount(shipmentStatus: ShipmentsStatus) {
    const [{ count: totalShipments }] = await this.db.client
      .select({ count: count() })
      .from(shipmentsTable)
      .where(eq(shipmentsTable.status, shipmentStatus));

    return totalShipments;
  }

  async create(dto: CreateShipmentDto) {
    await this.db.client.insert(shipmentsTable).values(dto);
  }

  async findCidByShipmentId(shipmentId: number): Promise<number | null> {
    const [data] = await this.db.client
      .select({ companyId: shipmentsTable.company_id })
      .from(shipmentsTable)
      .where(eq(shipmentsTable.id, shipmentId))
      .limit(1);

    return data?.companyId ?? null;
  }
}
