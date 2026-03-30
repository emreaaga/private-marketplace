import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { TripStopsRepository } from './trip-stops.repository';

@Module({
  imports: [DbModule],
  providers: [TripStopsRepository],
  exports: [TripStopsRepository],
})
export class TripStopsModule {}
