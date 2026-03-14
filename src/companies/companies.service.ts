import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { CompaniesRepository } from './companies.repository';
import {
  CompaniesLookupQueryDto,
  CompaniesQueryDto,
  CompanyUpdateDto,
  CreateCompanyDto,
} from './dto';

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly usersRep: UsersRepository,
  ) {}

  async findAll(filters: CompaniesQueryDto) {
    const data = await this.companiesRepository.findAll(filters);
    return data;
  }

  async lookup(dto: CompaniesLookupQueryDto) {
    const data = await this.companiesRepository.lookup(dto);
    return data;
  }

  async findOne(companyId: number) {
    const company = await this.companiesRepository.findOne(companyId);

    if (!company) {
      throw new NotFoundException('Фирма не найдена');
    }

    const employees = await this.usersRep.findAllByCompanyId(companyId);
    const totalEmployees =
      await this.usersRep.findEmployeesByCompanyId(companyId);

    return { company, employees, totalEmployees };
  }

  async create(dto: CreateCompanyDto) {
    await this.companiesRepository.create(dto);
  }

  async update(companyId: number, dto: CompanyUpdateDto) {
    const updatedCompany = await this.companiesRepository.update(
      companyId,
      dto,
    );

    if (!updatedCompany) {
      throw new NotFoundException('Фирма не найдена');
    }

    return updatedCompany;
  }
}
