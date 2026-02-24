import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import {
  CreateShipmentDto,
  ShipmentsQueryDto,
  ShipmentsLookupQueryDto,
} from './dto';
import { PaginatedResponse } from 'src/common/types';

@Controller('/shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  async findAll(@Query() dto: ShipmentsQueryDto): Promise<PaginatedResponse> {
    const { data, pagination } = await this.shipmentsService.findAll(dto);
    return { data, pagination };
  }

  @Get('/lookup')
  async lookup(@Query() dto: ShipmentsLookupQueryDto) {
    const data = await this.shipmentsService.lookup(dto);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const [data] = await this.shipmentsService.findOne(id);
    return { data };
  }

  @Post()
  async create(@Body() dto: CreateShipmentDto) {
    await this.shipmentsService.create(dto);
    return { message: 'shipment created!' };
  }
}
