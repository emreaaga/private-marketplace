import { Injectable } from '@nestjs/common';
import {
  and,
  count,
  countDistinct,
  desc,
  eq,
  exists,
  sql,
  SQL,
  sum,
} from 'drizzle-orm';
import { PaginatedResponse } from 'src/common/types';
import { calculatePagination } from 'src/common/utils/pagination.util';
import { AllCompanyType } from 'src/companies/dto/company-type';
import { DbService } from 'src/db/db.service';
import { DbTransaction } from 'src/db/db.types';
import { flightsTable, ordersTable, shipmentsTable } from 'src/db/schema';
import { CreateFlightDto, FlightsQueryDto } from './dto';

@Injectable()
export class FlightsRepository {
  constructor(private readonly db: DbService) {}

  async findAllAdmin(filters: FlightsQueryDto): Promise<PaginatedResponse> {
    const page = filters.page;
    const limit = 10;
    const offset = (page - 1) * limit;

    const flightStats = this.db.client
      .select({
        flight_id: shipmentsTable.flight_id,
        total_shipments: countDistinct(shipmentsTable.id).as('total_shipments'),
        total_prepaid: sum(ordersTable.prepaid_amount).as('total_prepaid'),
        total_amount: sum(ordersTable.total_amount).as('total_amount'),
      })
      .from(shipmentsTable)
      .innerJoin(ordersTable, eq(ordersTable.shipment_id, shipmentsTable.id))
      .groupBy(shipmentsTable.flight_id)
      .as('flight_stats');

    const flights = await this.db.client
      .select({
        id: flightsTable.id,
        route: sql<string>`upper(${flightsTable.from_city}) || '→' || upper(${flightsTable.to_city})`,
        air_kg_price: flightsTable.air_kg_price,
        final_gross_weight_kg: flightsTable.final_gross_weight_kg,
        status: flightsTable.status,
        arrival_at: flightsTable.arrival_at,
        total_shipments: sql<string>`coalesce(${flightStats.total_shipments}, '0')`,
        prepaid_sum: sql<string>`coalesce(${flightStats.total_prepaid}, '0')`,
        remaining_sum: sql<string>`coalesce(${flightStats.total_amount}, '0')::numeric - coalesce(${flightStats.total_prepaid}, '0')::numeric`,
      })
      .from(flightsTable)
      .leftJoin(flightStats, eq(flightsTable.id, flightStats.flight_id))
      .orderBy(desc(flightsTable.created_at), desc(flightsTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(flightsTable);

    return {
      data: flights,
      pagination: calculatePagination(page, total, limit),
    };
  }

  async findAllForRole(
    filters: FlightsQueryDto,
    companyId: number,
    companyType: AllCompanyType,
  ): Promise<PaginatedResponse> {
    const page = filters.page;
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [];

    if (companyType === 'postal') {
      whereConditions.push(
        exists(
          this.db.client
            .select()
            .from(shipmentsTable)
            .where(
              and(
                eq(shipmentsTable.flight_id, flightsTable.id),
                eq(shipmentsTable.company_id, companyId),
              ),
            ),
        ),
      );
    } else if (companyType === 'customs_broker') {
      whereConditions.push(eq(flightsTable.receiver_customs_id, companyId));
    } else if (companyType === 'air_partner') {
      whereConditions.push(eq(flightsTable.air_partner_id, companyId));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    const flights = await this.db.client
      .select({
        id: flightsTable.id,
        route: sql<string>`upper(${flightsTable.from_city}) || '→' || upper(${flightsTable.to_city})`,
        final_gross_weight_kg: flightsTable.final_gross_weight_kg,
        status: flightsTable.status,
        arrival_at: flightsTable.arrival_at,
      })
      .from(flightsTable)
      .where(whereClause)
      .orderBy(desc(flightsTable.created_at), desc(flightsTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(flightsTable)
      .where(whereClause);

    return {
      data: flights,
      pagination: calculatePagination(page, total, limit),
    };
  }

  async updateStatus() {}

  async findOne(flightId: number) {
    const [flight] = await this.db.client
      .select({
        id: flightsTable.id,

        departure_location: {
          country: flightsTable.from_country,
          city: flightsTable.from_city,
        },
        arrival_location: {
          country: flightsTable.to_country,
          city: flightsTable.to_city,
        },

        air_partner_id: flightsTable.air_partner_id,
        sender_customs_id: flightsTable.sender_customs_id,
        receiver_customs_id: flightsTable.receiver_customs_id,

        air_kg_price: flightsTable.air_kg_price,
        sender_customs_kg_price: flightsTable.sender_customs_kg_price,
        receiver_customs_kg_price: flightsTable.receiver_customs_kg_price,

        loading_at: flightsTable.loading_at,
        departure_at: flightsTable.departure_at,

        arrival_at: flightsTable.arrival_at,
        unloading_at: flightsTable.unloading_at,

        awb_number: flightsTable.awb_number,
        final_gross_weight_kg: flightsTable.final_gross_weight_kg,
        status: flightsTable.status,
        is_paid: flightsTable.is_paid,
        paid_at: flightsTable.paid_at,
        created_at: flightsTable.created_at,
      })
      .from(flightsTable)
      .where(eq(flightsTable.id, flightId));

    return flight;
  }

  async create(dto: CreateFlightDto, tx?: DbTransaction) {
    const db = tx ?? this.db.client;

    const [flight] = await db
      .insert(flightsTable)
      .values({
        from_country: dto.departure_location.country,
        from_city: dto.departure_location.city,

        to_country: dto.arrival_location.country,
        to_city: dto.arrival_location.city,

        air_partner_id: dto.air_partner_id,
        sender_customs_id: dto.sender_customs_id,
        receiver_customs_id: dto.receiver_customs_id,

        air_kg_price: dto.air_kg_price,
        sender_customs_kg_price: dto.sender_customs_kg_price,
        receiver_customs_kg_price: dto.receiver_customs_kg_price,

        loading_at: new Date(dto.loading_at),
        departure_at: new Date(dto.departure_at),
        arrival_at: new Date(dto.arrival_at),
        unloading_at: new Date(dto.unloading_at),
      })
      .returning({ id: flightsTable.id });

    return flight;
  }
}
