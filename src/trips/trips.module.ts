import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DbModule } from 'src/db/db.module';
import { FlightsModule } from 'src/flights/flights.module';
import { OrdersModule } from 'src/orders/orders.module';
import { TripStopsModule } from 'src/trip-stops/trip-stops.module';
import { TripsController } from './trips.controller';
import { TripsRepository } from './trips.repository';
import { TripsService } from './trips.service';

@Module({
  imports: [
    DbModule,
    CommonModule,
    TripStopsModule,
    OrdersModule,
    FlightsModule,
  ],
  controllers: [TripsController],
  providers: [TripsService, TripsRepository],
})
export class TripsModule {}
