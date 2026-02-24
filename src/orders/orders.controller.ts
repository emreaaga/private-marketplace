import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { PaginatedResponse } from 'src/common/types';

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

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
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
