import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CompanyTypes } from 'src/common/decorators/company-types.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AccessTokenGuard, AccessGuard)
export class DashboardController {
  constructor(private readonly dashboardSer: DashboardService) {}

  @Get('stats')
  @Roles('admin', 'company_owner', 'employee')
  @CompanyTypes(
    'platform',
    'postal',
    'customs_broker',
    'air_partner',
    'airline',
  )
  async getMainStats() {
    const data = await this.dashboardSer.getMainStats();
    return { data };
  }

  @Roles('admin')
  @CompanyTypes('platform')
  @Post('dev-seed')
  async seedFullCycle() {
    await this.dashboardSer.seedFullCycle();
    return { message: 'Seed created' };
  }

  @Roles('admin')
  @CompanyTypes('platform')
  @Post('dev-clear')
  async clearDatabase() {
    await this.dashboardSer.clearDatabase();
    return { message: 'Database cleared' };
  }
}
