import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto, CompaniesQueryDto } from './dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  async findAll(filters: CompaniesQueryDto): Promise<object> {
    return await this.companiesRepository.findAll(filters);
  }

  async create(dto: CreateCompanyDto) {
    await this.companiesRepository.create(dto);
  }

  async deleteOne(id: number) {
    await this.companiesRepository.deleteOne(id);
  }
}
