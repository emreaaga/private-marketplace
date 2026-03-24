import { Injectable } from '@nestjs/common';
import { BranchesRepository } from './branches.repository';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly branchesRep: BranchesRepository) {}

  async findAllByCompany(companyId: number) {
    const data = await this.branchesRep.findAllByCompany(companyId);
    return data;
  }

  async create(companyId: number, dto: CreateBranchDto) {
    await this.branchesRep.create(
      companyId,
      dto.name,
      dto.location.country,
      dto.location.city,
      false,
    );
  }
}
