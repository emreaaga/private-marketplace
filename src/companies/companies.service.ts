import { Injectable } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly companiesRepository: CompaniesRepository) {}

  findAll(): object {
    return this.companiesRepository.findAll();
  }

  async create(dto: CreateCompanyDto) {
    await this.companiesRepository.create(dto);
  }

  async deleteOne(id: number) {
    await this.companiesRepository.deleteOne(id);
  }
}
