// Poytaxt express
//emag704@gmail.com
// QN4BKTHr$eTU

//Coffee express
//emag281@gmail.com
//h7t4sZdsdoZp

// baraka express
// else189@gmail.com
// mYNDvU%w267U

import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { CompanyTypes } from 'src/common/decorators/company-types.decorator';
import { User } from 'src/common/decorators/get-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { type AccessTokenPayload } from 'src/common/types';
import {
  CreateServiceDto,
  ServicesLookupQueryDto,
  ServicesQueryDto,
} from './dto';
import { ServicesService } from './services.service';

@UseGuards(AccessTokenGuard, AccessGuard)
@Roles('admin', 'company_owner')
@CompanyTypes('platform', 'postal', 'customs_broker', 'airline', 'air_partner')
@Controller('/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll(
    @Query() dto: ServicesQueryDto,
    @User() user: AccessTokenPayload,
  ) {
    const result = await this.servicesService.findAll(dto, user.cid, user.role);
    return result;
  }

  @Get('lookup')
  async lookup(@Query() dto: ServicesLookupQueryDto) {
    const data = await this.servicesService.lookup(dto);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.servicesService.findOne(id);

    if (data === undefined) {
      throw new NotFoundException('Service not found');
    }

    return { data };
  }

  @Patch(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(@Param('id', ParseIntPipe) id: number) {
    return { message: 'Service updated.' };
  }

  @Post()
  async create(@Body() dto: CreateServiceDto) {
    await this.servicesService.create(dto);
    return { message: 'created successfully' };
  }
}
