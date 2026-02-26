import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { ServicesModule } from './services/services.module';
import { FlightsModule } from './flights/flights.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { FlightExpensesModule } from './flight-expenses/flight-expenses.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FinancialEventsModule } from './financial-events/financial-events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    DbModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
    ServicesModule,
    FlightsModule,
    ShipmentsModule,
    ClientsModule,
    OrdersModule,
    OrderItemsModule,
    FlightExpensesModule,
    DashboardModule,
    FinancialEventsModule,
  ],
})
export class AppModule {}
