import { Injectable } from '@nestjs/common';
import { FlightExpensesRepository } from './flight-expenses.repository';
import { FlightExpensesQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class FLightExpensesService {
  constructor(private readonly FlightExpensesRep: FlightExpensesRepository) {}

  async findAll(dto: FlightExpensesQueryDto): Promise<PaginatedResponse> {
    const data = await this.FlightExpensesRep.findAll(dto);
    return data;
  }
}
