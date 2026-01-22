import { Controller, Get, Post, Body } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Get()
  async findAll() {
    const result = await this.servicesService.findAll();
    return result;
  }

  @Post()
  async create(@Body() dto: CreateServiceDto) {
    await this.servicesService.create(dto);
    return { message: 'created successfully' };
  }
}
