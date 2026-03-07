import { Injectable, NotFoundException } from '@nestjs/common';
import { PasswordService } from 'src/common/services';
import {
  type AllUserRoles,
  CreateUserDto,
  UpdateUserDto,
  UsersQueryDto,
} from './dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );
    dto.password = hashedPassword;

    await this.usersRepository.create(dto);
  }

  async update(userId: number, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await this.passwordService.hashPassword(dto.password);
    }
    const updatedUser = await this.usersRepository.update(userId, dto);

    if (!updatedUser) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  async findAll(
    query: UsersQueryDto,
    companyId?: number,
    userRole?: AllUserRoles,
  ) {
    const targetCompanyId = userRole === 'admin' ? undefined : companyId;

    const data = await this.usersRepository.allUsers(query, targetCompanyId);

    return data;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.oneUser(id);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async deleteUser(id: number) {
    const result = await this.usersRepository.deleteUser(id);

    if (!result) {
      throw new NotFoundException('User not found!');
    }
  }
}
