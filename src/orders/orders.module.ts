import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { DbModule } from 'src/db/db.module';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';

@Module({
  imports: [DbModule],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrdersService],
})
export class OrdersModule {}
