import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CompanyTypes } from 'src/common/decorators/company-types.decorator';
import { User } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { type AccessTokenPayload, PaginatedResponse } from 'src/common/types';
import { CreateFlightDto, FlightsQueryDto } from './dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightsService } from './flights.service';

@UseGuards(AccessTokenGuard, AccessGuard)
@Controller('/flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Get()
  @Roles('admin', 'company_owner')
  @CompanyTypes('platform', 'postal', 'customs_broker', 'air_partner')
  async findAll(
    @Query() dto: FlightsQueryDto,
    @User() user: AccessTokenPayload,
  ): Promise<PaginatedResponse> {
    const { data, pagination } = await this.flightsService.findAll(
      dto,
      user.cid,
      user.ctype,
    );

    return { data, pagination };
  }

  @Get(':id')
  @Roles('admin')
  @CompanyTypes('platform')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.flightsService.findOne(id);
    return { data };
  }

  @Get(':id/summary')
  @Roles('admin')
  @CompanyTypes('platform')
  async getSummary(@Param('id', ParseIntPipe) id: number) {
    const data = await this.flightsService.getSummary(id);
    return { data };
  }

  @Post()
  @Roles('admin')
  @CompanyTypes('platform')
  async create(@Body() dto: CreateFlightDto) {
    await this.flightsService.create(dto);
    return { message: 'Created successfully' };
  }

  @Put(':id')
  @Roles('admin')
  @CompanyTypes('platform')
  async update(
    @Param('id', ParseIntPipe) flightId: number,
    @Body() dto: UpdateFlightDto,
  ) {
    await this.flightsService.update(flightId, dto);
    return { message: 'Flight updated' };
  }
}
