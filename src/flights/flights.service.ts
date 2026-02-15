import { Injectable } from '@nestjs/common';
import { FlightsRepository } from './flights.repository';
import { CreateFlightDto, FlightsQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class FlightsService {
  constructor(private readonly flightsRepository: FlightsRepository) {}

  async findAll(dto: FlightsQueryDto): Promise<PaginatedResponse> {
    const data = await this.flightsRepository.findAll(dto);
    return data;
  }

  async findOne(id: number) {
    const flight = await this.flightsRepository.findOne(id);
    return flight;
  }

  async create(dto: CreateFlightDto) {
    await this.flightsRepository.create(dto);
  }
}
