import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { FlightsRepository } from 'src/flights/flights.repository';
import { OrdersRepository } from 'src/orders/orders.repository';
import { TripStopsRepository } from 'src/trip-stops/trip-stops.repository';
import { CreateTripDto, TripsQueryDto } from './dto';
import { TripsStopsOrdersDto } from './dto/trips-stops-orders.dto';
import { TripsRepository } from './trips.repository';

@Injectable()
export class TripsService {
  constructor(
    private readonly tripsRep: TripsRepository,
    private readonly tripStopsRep: TripStopsRepository,
    private readonly db: DbService,
    private readonly ordersRep: OrdersRepository,
    private readonly flightsRep: FlightsRepository,
  ) {}

  async findALl(dto: TripsQueryDto) {
    const data = await this.tripsRep.findAll(dto);
    return data;
  }

  async findOne(tripId: number) {
    const data = await this.tripStopsRep.findOne(tripId);
    return data;
  }

  async findTripStopOrders(
    tripId: number,
    branchId: number,
    dto: TripsStopsOrdersDto,
  ) {
    const { data, pagination } = await this.ordersRep.findByBranchAndTrip(
      tripId,
      branchId,
      dto,
    );
    return { data, pagination };
  }

  async create(dto: CreateTripDto, companyId: number) {
    await this.db.client.transaction(async (tx) => {
      const newTrip = await this.tripsRep.create(dto.flight_id, companyId, tx);

      const stopsData = dto.stops.map((stop) => ({
        trip_id: newTrip.id,
        branch_id: stop.branch_id,
        stop_order: stop.stop_order,
      }));

      await this.tripStopsRep.createMany(stopsData, tx);

      const branchIds = dto.stops.map((s) => s.branch_id);

      await this.ordersRep.linkOrdersToTrip(
        dto.flight_id,
        newTrip.id,
        branchIds,
        tx,
      );

      await this.flightsRep.changeStatus(dto.flight_id, 'closed', tx);
    });
  }
}
