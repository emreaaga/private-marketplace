import { Module } from '@nestjs/common';
import { BranchesModule } from 'src/branches/branches.module';
import { CommonModule } from 'src/common/common.module';
import { DbModule } from 'src/db/db.module';
import { FlightExpensesModule } from 'src/flight-expenses/flight-expenses.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { FlightsController } from './flights.controller';
import { FlightsRepository } from './flights.repository';
import { FlightsService } from './flights.service';

@Module({
  imports: [
    DbModule,
    FlightExpensesModule,
    ShipmentsModule,
    CommonModule,
    BranchesModule,
    OrdersModule,
  ],
  controllers: [FlightsController],
  providers: [FlightsService, FlightsRepository],
  exports: [FlightsRepository],
})
export class FlightsModule {}
