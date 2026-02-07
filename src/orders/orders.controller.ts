import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    console.log(dto);
    return { message: 'Order created!' };
  }

  @Get()
  async findAll() {
    const data = await this.ordersService.findAll();
    return { data };
  }
}
