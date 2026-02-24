import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from 'src/companies/companies.repository';
import { ShipmentsRepository } from 'src/shipments/shipments.repository';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class DashboardService {
  constructor(
    private readonly companiesRep: CompaniesRepository,
    private readonly usersRep: UsersRepository,
    private readonly shipmentsRep: ShipmentsRepository,
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
}
