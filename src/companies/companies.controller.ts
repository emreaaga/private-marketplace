import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CompanyTypes } from 'src/common/decorators/company-types.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ParseIdPipe } from 'src/common/pipes/parse-id.pipe';
import { PaginatedResponse } from 'src/common/types';
import { CompaniesService } from './companies.service';
import {
  CompaniesLookupQueryDto,
  CompaniesQueryDto,
  CompanyUpdateDto,
  CreateCompanyDto,
} from './dto';

@UseGuards(AccessTokenGuard, AccessGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Roles('admin')
  @CompanyTypes('platform')
  @Post()
  async create(@Body() dto: CreateCompanyDto): Promise<object> {
    await this.companiesService.create(dto);

    return {
      message: 'Company created successfully',
    };
  }

  @Roles('admin')
  @CompanyTypes('platform')
  @Get()
  async findAll(@Query() dto: CompaniesQueryDto): Promise<PaginatedResponse> {
    const { data, pagination } = await this.companiesService.findAll(dto);
    return { data, pagination };
  }

  @Roles('admin')
  @CompanyTypes('platform')
  @Get('lookup')
  async lookup(@Query() dto: CompaniesLookupQueryDto): Promise<object> {
    const data = await this.companiesService.lookup(dto);
    return { data };
  }

  @Roles('admin')
  @CompanyTypes('platform')
  @Patch(':id')
  async update(
    @Param('id', ParseIdPipe) companyId: number,
    @Body() dto: CompanyUpdateDto,
  ) {
    await this.companiesService.update(companyId, dto);
    return { message: 'Company updated.' };
  }

  @Roles('admin')
  @CompanyTypes('platform')
  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) companyId: number) {
    const { company, employees, totalEmployees } =
      await this.companiesService.findOne(companyId);
    return { data: company, totalEmployees, employees };
  }
}
