import { Module } from '@nestjs/common';
import { BranchesModule } from 'src/branches/branches.module';
import { ClientPassportsModule } from 'src/client-passports/client-passports.module';
import { ClientsModule } from 'src/clients/clients.module';
import { ClientsRepository } from 'src/clients/clients.repository';
import { CommonModule } from 'src/common/common.module';
import { DbModule } from 'src/db/db.module';
import { FinancialEventsModule } from 'src/financial-events/financial-events.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    DbModule,
    ClientsModule,
    ClientPassportsModule,
    OrderItemsModule,
    FinancialEventsModule,
    CommonModule,
    ShipmentsModule,
    BranchesModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrdersService, ClientsRepository],
  exports: [OrdersRepository],
})
export class OrdersModule {}
