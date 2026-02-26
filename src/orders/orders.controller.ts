import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrdersQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';
import { ParseIdPipe } from 'src/common/pipes/parse-id.pipe';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    await this.ordersService.create(dto);
    return { message: 'Order created!' };
  }

  @Get()
  async findAll(@Query() dto: OrdersQueryDto): Promise<PaginatedResponse> {
    const { data, pagination } = await this.ordersService.findAll(dto);
    return { data, pagination };
  }

  @Get(':id/summary')
  async getSummary(@Param('id', ParseIdPipe) id: number) {
    const data = await this.ordersService.getSummary(id);

    if (!data) throw new NotFoundException();

    return { data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const { summary, sender, receiver, orderItems } =
      await this.ordersService.findOne(id);

    return {
      sender,
      receiver,
      orderItems,
      summary,
    };
  }
}
