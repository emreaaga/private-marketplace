import { Controller, Query, Get } from '@nestjs/common';
import { FinancialEventsService } from './financial-events.service';
import { FinancialEventsQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Controller('/financial-events')
export class FinancialEventsController {
  constructor(private readonly fEventsService: FinancialEventsService) {}

  @Get()
  findAll(@Query() dto: FinancialEventsQueryDto): Promise<PaginatedResponse> {
    const data = this.fEventsService.findAll(dto);
    return data;
  }
}
