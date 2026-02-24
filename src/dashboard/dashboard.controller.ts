import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardSer: DashboardService) {}

  @Get('stats')
  async getMainStats() {
    const data = await this.dashboardSer.getMainStats();
    return { data };
  }
}
