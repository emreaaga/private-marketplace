import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

type UserStatuses = 'pending' | 'active' | 'blocked';
type UserRoles = 'admin' | 'user' | 'manager';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
