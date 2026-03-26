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
import { type AccessTokenPayload, PaginatedResponse } from 'src/common/types';
import {
  CreateShipmentDto,
  ShipmentsLookupQueryDto,
  ShipmentsQueryDto,
} from './dto';
import { ShipmentsService } from './shipments.service';

@UseGuards(AccessTokenGuard, AccessGuard)
@Controller('/shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Get()
  @Roles('admin', 'company_owner')
  @CompanyTypes('platform', 'postal', 'customs_broker')
  async findAll(
    @Query() dto: ShipmentsQueryDto,
    @User() user: AccessTokenPayload,
  ): Promise<PaginatedResponse> {
    const { data, pagination } = await this.shipmentsService.findAll(
      dto,
      user.cid,
      user.ctype,
    );

    return { data, pagination };
  }

  @Roles('admin', 'company_owner')
  @CompanyTypes('platform', 'postal', 'customs_broker')
  @Get('/lookup')
  async lookup(
    @Query() dto: ShipmentsLookupQueryDto,
    @User() user: AccessTokenPayload,
  ) {
    const data = await this.shipmentsService.lookup(dto, user.cid, user.ctype);
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const [data] = await this.shipmentsService.findOne(id);
    return { data };
  }

  @Post()
  @Roles('admin', 'company_owner')
  @CompanyTypes('platform', 'postal')
  async create(
    @Body() dto: CreateShipmentDto,
    @User() user: AccessTokenPayload,
  ) {
    await this.shipmentsService.create(dto, user.cid, user.ctype);
    return { message: 'shipment created!' };
  }
}
