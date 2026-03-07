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
import { ParseIdPipe } from 'src/common/pipes/parse-id.pipe';
import { PaginatedResponse } from 'src/common/types';
import { CompaniesService } from './companies.service';
import {
  CompaniesLookupQueryDto,
  CompaniesQueryDto,
  CompanyUpdateDto,
  CreateCompanyDto,
} from './dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  async create(@Body() dto: CreateCompanyDto): Promise<object> {
    await this.companiesService.create(dto);

    return {
      message: 'Company created successfully',
    };
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Query() dto: CompaniesQueryDto): Promise<PaginatedResponse> {
    const { data, pagination } = await this.companiesService.findAll(dto);
    return { data, pagination };
  }

  @Get('lookup')
  async lookup(@Query() dto: CompaniesLookupQueryDto): Promise<object> {
    const data = await this.companiesService.lookup(dto);
    return { data };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIdPipe) companyId: number,
    @Body() dto: CompanyUpdateDto,
  ) {
    await this.companiesService.update(companyId, dto);
    return { message: 'Company updated.' };
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const data = await this.companiesService.findOne(id);
    return { data };
  }
}
