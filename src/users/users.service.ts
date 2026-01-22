import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUser } from './dto/types/create-user.types';
import { PasswordService } from 'src/common/services';

type UserStatuses = 'pending' | 'active' | 'blocked';
type UserRoles = 'admin' | 'company_owner';

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

  async findAll() {
    const users = await this.usersRepository.allUsers();

    return users;
  }

  async findOne(id: number) {
    const user = await this.usersRepository.oneUser(id);

    return user;
  }

  async deleteUser(id: number) {
    await this.usersRepository.deleteUser(id);
  }

  async updateStatus(id: number, status: UserStatuses) {
    await this.usersRepository.changeStatus(id, status);
  }

  async updateRole(id: number, role: UserRoles) {
    await this.usersRepository.changeRole(id, role);
  }
}
