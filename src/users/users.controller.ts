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
} from '@nestjs/common';
import { UpdateRoleDto, UpdateStatusDto } from './dto';
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

  //TODO Must add pagination for list of users
  @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(): Promise<object> {
    const users = await this.usersService.findAll();
    return { message: 'Paginated list of users.', users };
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return { message: 'Current user', user };
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deleteUser(id);
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
