import { Module } from '@nestjs/common';
import { FinancialEventsController } from './financial-events.controller';
import { FinancialEventsService } from './financial-events.service';
import { FinancialEventsRepository } from './financial-events.repository';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [FinancialEventsController],
  providers: [FinancialEventsRepository, FinancialEventsService],
  exports: [FinancialEventsRepository],
})
export class FinancialEventsModule {}
