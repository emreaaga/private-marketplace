import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CompanyTypes } from 'src/common/decorators/company-types.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ParseIdPipe } from 'src/common/pipes/parse-id.pipe';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';

@Controller('branches')
@UseGuards(AccessTokenGuard, AccessGuard)
export class BranchesController {
  constructor(private readonly branchesSer: BranchesService) {}

  @Roles('admin')
  @CompanyTypes('platform')
  @Get(':id')
  async findAllByCompany(@Param('id', ParseIdPipe) companyId: number) {
    const data = await this.branchesSer.findAllByCompany(companyId);

    return { data };
  }

  @Roles('admin')
  @CompanyTypes('platform')
  @Post(':id')
  async create(
    @Param('id', ParseIdPipe) companyId: number,
    @Body() dto: CreateBranchDto,
  ) {
    await this.branchesSer.create(companyId, dto);
    return { message: 'Branch created' };
  }
}
