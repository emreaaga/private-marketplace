import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import {
  CreateServiceDto,
  ServicesQueryDto,
  ServicesLookupQueryDto,
} from './dto';

@Controller('/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  @Get()
  async findAll(@Query() dto: ServicesQueryDto) {
    const result = await this.servicesService.findAll(dto);
    return result;
  }

  @Get('lookup')
  async lookup(@Query() dto: ServicesLookupQueryDto) {
    const data = await this.servicesService.lookup(dto);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.servicesService.findOne(id);

    if (data === undefined) {
      throw new NotFoundException('Service not found');
    }

    return { data };
  }

  @Patch(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Service updated.' };
  }

  @Post()
  async create(@Body() dto: CreateServiceDto) {
    await this.servicesService.create(dto);
    return { message: 'created successfully' };
  }
}
