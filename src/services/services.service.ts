import { Injectable } from '@nestjs/common';
import { type AllUserRoles } from 'src/users/dto';
import {
  CreateServiceDto,
  ServicesLookupQueryDto,
  ServicesQueryDto,
} from './dto';
import { ServiceInsert, ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}

  async findAll(
    filters: ServicesQueryDto,
    cid: number,
    userRole: AllUserRoles,
  ) {
    const targetCompanyId = userRole === 'admin' ? undefined : cid;

    const services = await this.servicesRepository.findAll(
      filters,
      targetCompanyId,
    );
    return services;
  }

  async lookup(dto: ServicesLookupQueryDto) {
    const data = await this.servicesRepository.lookup(dto);
    return data;
  }

  async findOne(id: number) {
    const data = await this.servicesRepository.findOne(id);
    return data;
  }

  async create(dto: CreateServiceDto) {
    const insertData: ServiceInsert = {
      company_id: dto.company_id,
      type: dto.type,
      pricing_type: dto.pricing_type,
      price: dto.price.toString(),
    };

    await this.servicesRepository.create(insertData);
  }
}
