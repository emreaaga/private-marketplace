import { Injectable, NotFoundException } from '@nestjs/common';
import { PasswordService } from 'src/common/services';
import { CompaniesRepository } from 'src/companies/companies.repository';
import { DbService } from 'src/db/db.service';
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
    private readonly db: DbService,
    private readonly companiesRep: CompaniesRepository,
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(dto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );
    dto.password = hashedPassword;

    await this.db.client.transaction(async (tx) => {
      const companyPublicId = await this.companiesRep.findPublicIdByCid(
        dto.company_id,
        tx,
      );

      const roleConfigs = {
        company_owner: { prefix: 'B1', entity: 'D' },
        employee: { prefix: 'B1', entity: 'K' },
      };

      const config = roleConfigs[dto.role];

      const existingUsers = await this.usersRepository.findByRole(
        dto.role,
        dto.company_id,
        tx,
      );

      const nextNumber = existingUsers + 1;
      const sequence = String(nextNumber).padStart(3, '0');

      const userPublicId = `${companyPublicId}${config.prefix}${config.entity}${sequence}`;

      await this.usersRepository.create(dto, tx, userPublicId);
    });
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
