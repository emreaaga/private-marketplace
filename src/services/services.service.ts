import { Injectable } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { CreateServiceDto, FindServicesQueryDto } from './dto';
import { ServiceInsert } from './services.repository';

@Injectable()
export class ServicesService {
  constructor(private readonly servicesRepository: ServicesRepository) {}
  async findAll(filters: FindServicesQueryDto) {
    const services = await this.servicesRepository.findAll(filters);
    return services;
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
