import { Injectable } from '@nestjs/common';
import { eq, ne } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { usersTable } from 'src/db/schema';
import { companiesTable } from 'src/db/schema';
import { CreateUser } from './dto/types/create-user.types';
import { desc, count } from 'drizzle-orm';
import { UsersQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DbService) {}

  async allUsers(filters: UsersQueryDto): Promise<PaginatedResponse> {
    const limit = 10;
    const page = filters.page;
    const offset = (page - 1) * limit;

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
      .leftJoin(companiesTable, eq(usersTable.company_id, companiesTable.id))
      .where(ne(usersTable.role, 'admin'))
      .orderBy(desc(usersTable.created_at), desc(usersTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(usersTable)
      .where(ne(usersTable.role, 'admin'));

    const totalPages = Math.ceil(total / limit);

    const pagination = {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };

    return {
      data: users,
      pagination,
    };
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
        company_name: companiesTable.name,
        company_type: companiesTable.type,
        name: usersTable.name,
        surname: usersTable.surname,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        country: usersTable.country,
        city: usersTable.city,
        district: usersTable.district,
        address_line: usersTable.address_line,
        phone_country_code: usersTable.phone_country_code,
        phone_number: usersTable.phone_number,
        created_at: usersTable.created_at,
      })
      .from(usersTable)
      .leftJoin(companiesTable, eq(usersTable.company_id, companiesTable.id))
      .where(eq(usersTable.id, id));

    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const deleted = await this.db.client
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id });

    return deleted.length > 0;
  }

  async getTotalCount() {
    const [{ count: totalUsers }] = await this.db.client
      .select({ count: count() })
      .from(usersTable)
      .where(eq(usersTable.status, 'active'));

    return totalUsers;
  }
}
