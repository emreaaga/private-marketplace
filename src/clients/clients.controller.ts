import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto, ClientsQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Controller('clients')
export default class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll(@Query() dto: ClientsQueryDto): Promise<PaginatedResponse> {
    const { data, pagination } = await this.clientsService.findAll(dto);
    return { data, pagination };
  }

  @Post()
  async create(@Body() dto: CreateClientDto) {
    await this.clientsService.create(dto);
    return { message: 'Client created!' };
  }
}
