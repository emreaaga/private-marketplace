import { Injectable } from '@nestjs/common';
import { type AllUserRoles } from 'src/users/dto';
import {
  CreateServiceDto,
  ServicesLookupQueryDto,
  ServicesQueryDto,
} from './dto';
import { ServicesRepository } from './services.repository';

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
    await this.servicesRepository.create(dto);
  }
}
