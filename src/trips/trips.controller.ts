import {
  Body,
  Controller,
  Get,
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
import { type AccessTokenPayload } from 'src/common/types';
import { CreateTripDto, TripsQueryDto } from './dto';
import { TripsStopsOrdersDto } from './dto/trips-stops-orders.dto';
import { TripsService } from './trips.service';

@UseGuards(AccessTokenGuard, AccessGuard)
@Controller('trips')
@Roles('admin', 'company_owner')
@CompanyTypes('platform', 'customs_broker')
export class TripsController {
  constructor(private readonly tripsSer: TripsService) {}

  @Get()
  async findAll(@Query() dto: TripsQueryDto) {
    const { data, pagination } = await this.tripsSer.findALl(dto);

    return { data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) tripId: number) {
    const data = await this.tripsSer.findOne(tripId);
    return { data };
  }

  @Get(':id/stops/:branchId/orders')
  async findTripStopOrders(
    @Param('id', ParseIdPipe) tripId: number,
    @Param('branchId', ParseIdPipe) branchId: number,
    @Query() dto: TripsStopsOrdersDto,
  ) {
    const { data, pagination } = await this.tripsSer.findTripStopOrders(
      tripId,
      branchId,
      dto,
    );
    return { data, pagination };
  }

  @Post()
  async create(@Body() dto: CreateTripDto, @User() user: AccessTokenPayload) {
    await this.tripsSer.create(dto, user.cid);
    return { message: 'Trip created' };
  }
}
