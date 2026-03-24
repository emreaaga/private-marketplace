import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchesRepository } from 'src/branches/branches.repository';
import { DbService } from 'src/db/db.service';
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
    private readonly branchesRep: BranchesRepository,
    private readonly db: DbService,
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
    await this.db.client.transaction(async (tx) => {
      const companyId = await this.companiesRepository.create(dto, tx);
      await this.branchesRep.create(
        companyId,
        'Главный филиал',
        dto.location.country,
        dto.location.city,
        true,
        tx,
      );
    });
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
