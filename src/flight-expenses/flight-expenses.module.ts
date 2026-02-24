import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { FlightExpensesController } from './flight-expenses.controller';
import { FlightExpensesRepository } from './flight-expenses.repository';
import { FLightExpensesService } from './flight-expenses.service';

@Module({
  imports: [DbModule],
  controllers: [FlightExpensesController],
  providers: [FlightExpensesRepository, FLightExpensesService],
  exports: [FlightExpensesRepository],
})
export class FlightExpensesModule {}
