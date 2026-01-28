import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentsQueryDto } from './dto/shipments-query.dto';

@Controller('/shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  async findAll(@Query() query: ShipmentsQueryDto) {
    const data = await this.shipmentsService.findAll(query);
    return { data };
  }

  @Post()
  async create(@Body() dto: CreateShipmentDto) {
    await this.shipmentsService.create(dto);
    return { message: 'shipment created!' };
  }
}
