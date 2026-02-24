import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
  Put,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto, FlightsQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Controller('/flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  async findAll(@Query() dto: FlightsQueryDto): Promise<PaginatedResponse> {
    const { data, pagination } = await this.flightsService.findAll(dto);

    return { data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.flightsService.findOne(id);
    return { data };
  }

  @Get(':id/summary')
  async getSummary(@Param('id', ParseIntPipe) id: number) {
    const data = await this.flightsService.getSummary(id);
    return { data };
  }

  @Post()
  async create(@Body() dto: CreateFlightDto) {
    await this.flightsService.create(dto);
    return { message: 'Created successfully' };
  }

  //TODO нужно создать DTO + реализовать обновление рейса
  @Put(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Flight updated' };
  }
}
