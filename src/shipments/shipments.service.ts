import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from 'src/common/types';
import { type AllCompanyType } from 'src/companies/dto/company-type';
import {
  CreateShipmentDto,
  ShipmentsLookupQueryDto,
  ShipmentsQueryDto,
} from './dto';
import { ShipmentsRepository } from './shipments.repository';

@Injectable()
export class ShipmentsService {
  constructor(private readonly shipmentsRepository: ShipmentsRepository) {}

  async findAll(
    query: ShipmentsQueryDto,
    companyId: number,
    companyType: AllCompanyType,
  ): Promise<PaginatedResponse> {
    if (companyType === 'postal') {
      query.company_id = companyId;
    }

    const result = await this.shipmentsRepository.findAll(query);
    return result;
  }

  async lookup(
    dto: ShipmentsLookupQueryDto,
    companyId: number,
    companyType: AllCompanyType,
  ) {
    if (companyType !== 'platform') {
      dto.company_id = companyId;
    }

    const data = await this.shipmentsRepository.lookup(dto);
    return data;
  }

  async findOne(id: string) {
    const shipment = await this.shipmentsRepository.findOne(Number(id));

    return shipment;
  }

  async create(
    dto: CreateShipmentDto,
    companyId: number,
    companyType: AllCompanyType,
  ) {
    if (companyType !== 'platform') {
      dto.company_id = companyId;
    }

    await this.shipmentsRepository.create(dto);
  }
}
