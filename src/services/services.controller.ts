import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, FindServicesQueryDto } from './dto';

@Controller('/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Get()
  async findAll(@Query() query: FindServicesQueryDto) {
    const result = await this.servicesService.findAll(query);
    return result;
  }

  @Post()
  async create(@Body() dto: CreateServiceDto) {
    await this.servicesService.create(dto);
    return { message: 'created successfully' };
  }
}
