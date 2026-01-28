import { Injectable } from '@nestjs/common';
import { ShipmentsRepository } from './shipments.repository';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentsQueryDto } from './dto/shipments-query.dto';

@Injectable()
export class ShipmentsService {
  constructor(private readonly shipmentsRepository: ShipmentsRepository) {}

  async findAll(query: ShipmentsQueryDto) {
    const result = await this.shipmentsRepository.findAll(query);
    return result;
  }

  async create(dto: CreateShipmentDto) {
    await this.shipmentsRepository.create(dto);
  }
}
