import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { flightsTable, companiesTable, shipmentsTable } from 'src/db/schema';
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
}
