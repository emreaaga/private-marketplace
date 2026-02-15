import { Injectable } from '@nestjs/common';
import { ShipmentsRepository } from './shipments.repository';
import { CreateShipmentDto, ShipmentsQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class ShipmentsService {
  constructor(private readonly shipmentsRepository: ShipmentsRepository) {}

  async findAll(query: ShipmentsQueryDto): Promise<PaginatedResponse> {
    const result = await this.shipmentsRepository.findAll(query);
    return result;
  }

  async findOne(id: string) {
    const shipment = await this.shipmentsRepository.findOne(Number(id));

    return shipment;
  }

  async create(dto: CreateShipmentDto) {
    await this.shipmentsRepository.create(dto);
  }
}
