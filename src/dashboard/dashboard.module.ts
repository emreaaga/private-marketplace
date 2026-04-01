import { Module } from '@nestjs/common';

import { CommonModule } from 'src/common/common.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { DbModule } from 'src/db/db.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { UsersModule } from 'src/users/users.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    UsersModule,
    CompaniesModule,
    ShipmentsModule,
    OrderItemsModule,
    CommonModule,
    DbModule,
    OrdersModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
