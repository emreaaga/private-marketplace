import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentsQueryDto } from './dto/shipments-query.dto';
import { PaginatedResponse } from 'src/common/types';

@Controller('/shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  async findAll(@Query() query: ShipmentsQueryDto): Promise<PaginatedResponse> {
    const { data, pagination } = await this.shipmentsService.findAll(query);
    return { data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.shipmentsService.findOne(id);
    return { data };
  }

  @Post()
  async create(@Body() dto: CreateShipmentDto) {
    await this.shipmentsService.create(dto);
    return { message: 'shipment created!' };
  }
}
