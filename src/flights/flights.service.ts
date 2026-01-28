import { Injectable } from '@nestjs/common';
import { FlightsRepository } from './flights.repository';
import { CreateFlightDto } from './dto';

@Injectable()
export class FlightsService {
  constructor(private readonly flightsRepository: FlightsRepository) {}

  async findAll() {
    const data = await this.flightsRepository.findAll();
    return data;
  }

  async create(dto: CreateFlightDto) {
    await this.flightsRepository.create(dto);
  }
}
