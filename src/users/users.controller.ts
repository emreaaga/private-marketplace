import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  Post,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { UpdateRoleDto, UpdateStatusDto, UsersQueryDto } from './dto';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<object> {
    await this.usersService.create(dto);
    return { message: 'Successfully create user.' };
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Query() query: UsersQueryDto): Promise<object> {
    const { data, pagination } = await this.usersService.findAll(query);
    return { data, pagination };
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return { data: user };
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const result = await this.usersService.deleteUser(id);

    if (!result) {
      throw new NotFoundException('User not found!');
    }

    return { message: 'User deleted.' };
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    await this.usersService.updateStatus(id, dto.status);
    return { message: 'Changed user status.' };
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id/role')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    await this.usersService.updateRole(id, dto.role);
    return { message: 'Changed user role.' };
  }
}
