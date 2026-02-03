import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
export default class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  async findAll() {
    const data = await this.clientsService.findAll();
    return { data };
  }

  @Post()
  async create(@Body() dto: CreateClientDto) {
    await this.clientsService.create(dto);
    return { message: 'Client created!' };
  }
}
