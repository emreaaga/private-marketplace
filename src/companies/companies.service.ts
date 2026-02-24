import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import {
  CreateCompanyDto,
  CompaniesQueryDto,
  CompaniesLookupQueryDto,
} from './dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async findAll(filters: CompaniesQueryDto) {
    const data = await this.companiesRepository.findAll(filters);
    return data;
  }

  async lookup(dto: CompaniesLookupQueryDto) {
    const data = await this.companiesRepository.lookup(dto);
    return data;
  }

  async findOne(id: number) {
    const company = await this.companiesRepository.findOne(id);
    return company;
  }

  async create(dto: CreateCompanyDto) {
    await this.companiesRepository.create(dto);
  }
}
