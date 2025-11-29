import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { UpdateRoleDto, UpdateStatusDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //Must add pagination for list of users
  @Get()
  @HttpCode(200)
  async findAll(): Promise<object> {
    const users = await this.usersService.findAll();
    return { message: 'Paginated list of users.', users };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    return { message: 'Current user', user };
  }

  @Delete(':id')
  @HttpCode(200)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.usersService.deleteUser(id);
    return { message: 'User deleted.' };
  }

  @Patch(':id/status')
  @HttpCode(200)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {
    await this.usersService.updateStatus(id, dto.status);
    return { message: 'Changed user status.' };
  }

  @Patch(':id/role')
  @HttpCode(200)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    await this.usersService.updateRole(id, dto.role);
    return { message: 'Changed user role.' };
  }
}
