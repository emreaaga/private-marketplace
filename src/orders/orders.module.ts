import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { DbModule } from 'src/db/db.module';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { ClientsRepository } from 'src/clients/clients.repository';
import { ClientsModule } from 'src/clients/clients.module';
import { ClientPassportsModule } from 'src/client-passports/client-passports.module';
import { OrderItemsModule } from 'src/order-items/order-items.module';

@Module({
  imports: [DbModule, ClientsModule, ClientPassportsModule, OrderItemsModule],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrdersService, ClientsRepository],
})
export class OrdersModule {}
