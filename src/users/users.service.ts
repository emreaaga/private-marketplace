import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUser } from './dto/types/create-user.types';
import { PasswordService } from 'src/common/services';
import { UsersQueryDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(dto: CreateUser) {
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );
    dto.password = hashedPassword;

    await this.usersRepository.create(dto);
  }

  async findAll(query: UsersQueryDto) {
    const data = await this.usersRepository.allUsers(query);

    return data;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.oneUser(id);

    if (!user) {
      return;
    }

    return user;
  }

  async deleteUser(id: number) {
    const result = await this.usersRepository.deleteUser(id);
    return result;
  }
}
