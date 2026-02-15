import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto';
import { CompaniesQueryDto } from './dto';

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
  async findAll(@Query() query: CompaniesQueryDto): Promise<object> {
    const { data, pagination } = await this.companiesService.findAll(query);
    return { data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.companiesService.findOne(id);
    return { data };
  }

  @Delete(':id')
  async deleteCompany(@Param('id', ParseIntPipe) id: number): Promise<object> {
    const result = await this.companiesService.deleteOne(id);
    if (!result) {
      throw new NotFoundException('User not found.');
    }
    return {
      message: 'Company deleted successfully',
    };
  }
}
