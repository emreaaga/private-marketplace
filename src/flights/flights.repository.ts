import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import {
  flightsTable,
  companiesTable,
  shipmentsTable,
  ordersTable,
} from 'src/db/schema';
import { eq, sql, inArray } from 'drizzle-orm';
import { CreateFlightDto } from './dto';

@Injectable()
export class FlightsRepository {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateFlightDto) {
    return this.db.client.transaction(async (tx) => {
      const [flight] = await tx
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

      const result = await tx
        .update(shipmentsTable)
        .set({ flight_id: flight.id, status: 'ready' })
        .where(inArray(shipmentsTable.id, dto.shipments))
        .returning({ id: shipmentsTable.id });

      if (result.length !== dto.shipments.length) {
        throw new Error('Some shipments were not found!');
      }
    });
  }

  async findAll() {
    const shipmentsCountSubquery = sql<number>`
      (
        SELECT COUNT(*)
        FROM ${shipmentsTable}
        WHERE ${shipmentsTable.flight_id} = ${flightsTable.id}
      )
    `;

    const flights = await this.db.client
      .select({
        id: flightsTable.id,

        route: sql<string>`upper(${flightsTable.from_city}) || ' → ' || upper(${flightsTable.to_city})`,

        air_partner_name: companiesTable.name,
        air_kg_price: flightsTable.air_kg_price,

        final_gross_weight_kg: flightsTable.final_gross_weight_kg,

        shipments_count: shipmentsCountSubquery,

        status: flightsTable.status,
        arrival_at: flightsTable.arrival_at,
      })
      .from(flightsTable)
      .leftJoin(
        companiesTable,
        eq(flightsTable.air_partner_id, companiesTable.id),
      );
    return flights;
  }

  async findOne(id: number) {
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
      .where(eq(flightsTable.id, id));

    const shipments = await this.db.client
      .select({
        id: shipmentsTable.id,
        company_id: shipmentsTable.company_id,
        company_name: companiesTable.name,
        orders_count: sql<number>`count(${ordersTable.id})`,
        total_weight_kg: sql<string>`COALESCE(SUM(${ordersTable.weight_kg}), 0)`,
      })
      .from(shipmentsTable)
      .leftJoin(ordersTable, eq(ordersTable.shipment_id, shipmentsTable.id))
      .leftJoin(
        companiesTable,
        eq(companiesTable.id, shipmentsTable.company_id),
      )
      .where(eq(shipmentsTable.flight_id, id))
      .groupBy(
        shipmentsTable.id,
        companiesTable.name,
        shipmentsTable.company_id,
        shipmentsTable.status,
      );

    return { ...flight, shipments };
  }
}
