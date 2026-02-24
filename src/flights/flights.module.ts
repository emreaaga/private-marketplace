import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { FlightsRepository } from './flights.repository';
import { DbModule } from 'src/db/db.module';
import { FlightExpensesModule } from 'src/flight-expenses/flight-expenses.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';

@Module({
  imports: [DbModule, FlightExpensesModule, ShipmentsModule],
  controllers: [FlightsController],
  providers: [FlightsService, FlightsRepository],
})
export class FlightsModule {}
