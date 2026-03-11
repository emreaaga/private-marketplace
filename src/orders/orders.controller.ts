import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CompanyTypes } from 'src/common/decorators/company-types.decorator';
import { User } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ParseIdPipe } from 'src/common/pipes/parse-id.pipe';
import { type AccessTokenPayload, PaginatedResponse } from 'src/common/types';
import { CreateOrderDto, OrdersQueryDto } from './dto';
import { OrdersService } from './orders.service';

@UseGuards(AccessTokenGuard, AccessGuard)
@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('admin', 'company_owner')
  @CompanyTypes('platform', 'postal')
  async create(@Body() dto: CreateOrderDto, @User() user: AccessTokenPayload) {
    await this.ordersService.create(dto, user.ctype, user.cid);
    return { message: 'Order created!' };
  }

  @Get()
  @Roles('admin', 'company_owner')
  @CompanyTypes('platform', 'postal')
  async findAll(
    @Query() dto: OrdersQueryDto,
    @User() user: AccessTokenPayload,
  ): Promise<PaginatedResponse> {
    const { data, pagination, shipment_status } =
      await this.ordersService.findAll(dto, user.cid, user.ctype);
    return { data, pagination, shipment_status };
  }

  @Get(':id/summary')
  @Roles('admin', 'company_owner')
  @CompanyTypes('platform', 'postal')
  async getSummary(@Param('id', ParseIdPipe) id: number) {
    const data = await this.ordersService.getSummary(id);

    if (!data) throw new NotFoundException();

    return { data };
  }

  @Get(':id')
  @Roles('admin', 'company_owner')
  @CompanyTypes('platform', 'postal')
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
