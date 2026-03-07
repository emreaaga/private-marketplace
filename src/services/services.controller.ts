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
import { User } from 'src/common/decorators/get-user.decorator';
import { type AccessTokenPayload } from 'src/common/types';
import {
  CreateServiceDto,
  ServicesLookupQueryDto,
  ServicesQueryDto,
} from './dto';
import { ServicesService } from './services.service';

@Controller('/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
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
