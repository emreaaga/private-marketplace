import { BadRequestException, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { CompaniesRepository } from 'src/companies/companies.repository';
import { DbService } from 'src/db/db.service';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { OrdersRepository } from 'src/orders/orders.repository';
import { ShipmentsRepository } from 'src/shipments/shipments.repository';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly companiesRep: CompaniesRepository,
    private readonly usersRep: UsersRepository,
    private readonly ordersRep: OrdersRepository,
    private readonly orderItemsRep: OrderItemsRepository,
    private readonly shipmentsRep: ShipmentsRepository,
    private readonly db: DbService,
  ) {}

  async getMainStats() {
    const [totalPostal, totalUsers, expectedShipments] = await Promise.all([
      this.companiesRep.getTotalCount('postal'),
      this.usersRep.getTotalCount(),
      this.shipmentsRep.getTotalCount('draft'),
    ]);

    return {
      totalPostal,
      totalUsers,
      expectedShipments,
      expectedPayment: '0.00',
    };
  }

  async seedFullCycle() {
    await this.db.client.transaction(async (tx) => {
      const companyIds = await this.companiesRep.getCompaniesForSeed(tx);

      if (companyIds.length < 5) {
        throw new BadRequestException('5 фирм почт не существует');
      }

      const createdShipments = await this.shipmentsRep.createShipmentsForSeed(
        companyIds,
        tx,
      );

      const orderIds = await this.ordersRep.createOrdersForSeed(
        createdShipments,
        tx,
      );

      await this.orderItemsRep.createItemsForSeed(orderIds, tx);
    });
  }

  async clearDatabase() {
    await this.db.client.execute(sql`
      TRUNCATE TABLE
        orders,
        shipments,
        order_items,
        client_passports,
        clients,
        flights,
        trips
      RESTART IDENTITY CASCADE;
    `);
  }

  async getDirectoryStats() {
    const [usersData, companiesData] = await Promise.all([
      this.usersRep.countGroupedByRole(),
      this.companiesRep.countGroupedByType(),
    ]);

    return { usersData, companiesData };
  }
}
