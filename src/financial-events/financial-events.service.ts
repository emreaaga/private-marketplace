import { Injectable } from '@nestjs/common';
import { FinancialEventsRepository } from './financial-events.repository';
import { FinancialEventsQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class FinancialEventsService {
  constructor(private readonly fEventsRep: FinancialEventsRepository) {}

  async findAll(dto: FinancialEventsQueryDto): Promise<PaginatedResponse> {
    const data = await this.fEventsRep.findAll(dto);
    return data;
  }
}
