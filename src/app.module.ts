import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { BranchesModule } from './branches/branches.module';
import { ClientsModule } from './clients/clients.module';
import { CompaniesModule } from './companies/companies.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DbModule } from './db/db.module';
import { FinancialEventsModule } from './financial-events/financial-events.module';
import { FlightExpensesModule } from './flight-expenses/flight-expenses.module';
import { FlightsModule } from './flights/flights.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { OrdersModule } from './orders/orders.module';
import { ServicesModule } from './services/services.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { TripStopsModule } from './trip-stops/trip-stops.module';
import { TripsModule } from './trips/trips.module';
import { UsersModule } from './users/users.module';

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
    BranchesModule,
    TripsModule,
    TripStopsModule,
  ],
})
export class AppModule {}
