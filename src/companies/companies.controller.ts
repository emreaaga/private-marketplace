import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import {
  CreateCompanyDto,
  CompaniesQueryDto,
  CompaniesLookupQueryDto,
} from './dto';
import { PaginatedResponse } from 'src/common/types';

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

  //TODO Добавить логику обновления и dto для request body
  @Patch(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Company updated.' };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.companiesService.findOne(id);
    return { data };
  }
}
