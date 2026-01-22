import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { usersTable } from 'src/db/schema';
import { companiesTable } from 'src/db/schema';
import { CreateUser } from './dto/types/create-user.types';

type UserStatuses = 'pending' | 'active' | 'blocked';
type UserRoles = 'admin' | 'company_owner';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DbService) {}

  async allUsers() {
    const users = await this.db.client
      .select({
        id: usersTable.id,
        company_name: companiesTable.name,
        company_type: companiesTable.type,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .leftJoin(companiesTable, eq(usersTable.company_id, companiesTable.id));

    return users;
  }

  // Есть ошибка что company_id нету
  async create(dto: CreateUser) {
    await this.db.client.insert(usersTable).values({
      company_id: dto.company_id,
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      password_hash: dto.password,
      country: dto.country,
      city: dto.city,
      district: dto.district,
      address_line: dto.address_line,
      phone_country_code: dto.phone_country_code,
      phone_number: dto.phone_number,
      role: dto.role,
    });
  }

  async oneUser(id: number) {
    const [user] = await this.db.client
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    return user;
  }

  async deleteUser(id: number) {
    await this.db.client.delete(usersTable).where(eq(usersTable.id, id));
  }

  async changeStatus(id: number, status: UserStatuses) {
    await this.db.client
      .update(usersTable)
      .set({ status: status })
      .where(eq(usersTable.id, id));
  }

  async changeRole(id: number, role: UserRoles) {
    await this.db.client
      .update(usersTable)
      .set({ role: role })
      .where(eq(usersTable.id, id));
  }
}
