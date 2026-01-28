import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
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
    return await this.companiesService.findAll(query);
  }

  @Delete(':id')
  async deleteCompany(@Param('id', ParseIntPipe) id: number): Promise<object> {
    await this.companiesService.deleteOne(id);
    return {
      message: 'Company deleted successfully',
    };
  }
}
