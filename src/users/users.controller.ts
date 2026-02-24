import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Post,
  NotFoundException,
  Query,
  Patch,
} from '@nestjs/common';
import { UsersQueryDto } from './dto';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Body() dto: CreateUserDto): Promise<object> {
    await this.usersService.create(dto);
    return { message: 'Successfully create user.' };
  }

  // @UseGuards(AccessTokenGuard)
  @Get()
  async findAll(@Query() query: UsersQueryDto): Promise<object> {
    const { data, pagination } = await this.usersService.findAll(query);
    return { data, pagination };
  }

  // @UseGuards(AccessTokenGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }

    return { data: user };
  }

  //TODO Добавить логику обновления и dto для request body
  @Patch(':id')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(@Param('id', ParseIntPipe) id: number) {
    return { message: 'User updated.' };
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
}
