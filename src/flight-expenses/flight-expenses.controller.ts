import { Controller, Get, Query } from '@nestjs/common';
import { FlightExpensesQueryDto } from './dto';
import { FLightExpensesService } from './flight-expenses.service';
import { PaginatedResponse } from 'src/common/types';

@Controller('flight-expenses')
export class FlightExpensesController {
  constructor(private readonly flightExpensesService: FLightExpensesService) {}

  @Get()
  async findAll(
    @Query() dto: FlightExpensesQueryDto,
  ): Promise<PaginatedResponse> {
    const { data, pagination } = await this.flightExpensesService.findAll(dto);
    return { data, pagination };
  }
}
