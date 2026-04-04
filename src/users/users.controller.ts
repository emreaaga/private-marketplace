import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { User } from 'src/common/decorators/get-user.decorator';
import { ParseIdPipe } from 'src/common/pipes/parse-id.pipe';
import { type AccessTokenPayload } from 'src/common/types';
import { CreateUserDto, UpdateUserDto, UsersQueryDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<object> {
    await this.usersService.create(dto);
    return { message: 'Successfully create user.' };
  }

  @Get()
  async findAll(
    @Query() query: UsersQueryDto,
    @User() user: AccessTokenPayload,
  ): Promise<object> {
    const { data, pagination } = await this.usersService.findAll(
      query,
      user?.cid,
      user?.role,
    );
    return { data, pagination };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIdPipe) id: number) {
    const user = await this.usersService.findOne(id);

    return { data: user };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIdPipe) userId: number,
    @Body() dto: UpdateUserDto,
  ) {
    await this.usersService.update(userId, dto);
    return { message: 'User updated.' };
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIdPipe) id: number) {
    await this.usersService.deleteUser(id);

    return { message: 'User deleted.' };
  }
}
