import { Injectable } from '@nestjs/common';
import { and, count, desc, eq, ne, SQL } from 'drizzle-orm';
import { PaginatedResponse } from 'src/common/types';
import { DbService } from 'src/db/db.service';
import { companiesTable, usersTable } from 'src/db/schema';
import { CreateUserDto, UpdateUserDto, UsersQueryDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly db: DbService) {}

  async allUsers(
    filters: UsersQueryDto,
    companyId?: number,
  ): Promise<PaginatedResponse> {
    const limit = 10;
    const page = filters.page;
    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [ne(usersTable.role, 'admin')];

    if (companyId) {
      whereConditions.push(eq(usersTable.company_id, companyId));
    }

    const finalWhere = and(...whereConditions);

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
      .innerJoin(companiesTable, eq(usersTable.company_id, companiesTable.id))
      .where(finalWhere)
      .orderBy(desc(usersTable.created_at), desc(usersTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(usersTable)
      .where(finalWhere);

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

  async create(dto: CreateUserDto) {
    await this.db.client.insert(usersTable).values({
      company_id: dto.company_id,
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      password_hash: dto.password,
      country: dto.location.country,
      city: dto.location.city,
      district: dto.location.district,
      address_line: dto.address_line,
      phone_country_code: dto.phone_country_code,
      phone_number: dto.phone_number,
      role: dto.role,
    });
  }

  async oneUser(userId: number) {
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
      .where(eq(usersTable.id, userId));

    return user;
  }

  async findUserByEmail(userEmail: string) {
    const [user] = await this.db.client
      .select({
        id: usersTable.id,
        name: usersTable.name,
        role: usersTable.role,
        password: usersTable.password_hash,
        company_id: companiesTable.id,
        company_name: companiesTable.name,
        company_type: companiesTable.type,
      })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, userEmail),
          eq(usersTable.status, 'active'),
          eq(companiesTable.is_active, true),
        ),
      )
      .innerJoin(companiesTable, eq(usersTable.company_id, companiesTable.id))
      .limit(1);

    return user;
  }

  async findUserById(userId: number) {
    const [user] = await this.db.client
      .select({
        id: usersTable.id,
        name: usersTable.name,
        role: usersTable.role,
        company_id: usersTable.company_id,
        company_name: companiesTable.name,
        company_type: companiesTable.type,
      })
      .from(usersTable)
      .where(
        and(
          eq(usersTable.id, userId),
          eq(usersTable.status, 'active'),
          eq(companiesTable.is_active, true),
        ),
      )
      .innerJoin(companiesTable, eq(companiesTable.id, usersTable.company_id))
      .limit(1);

    return user;
  }

  async update(userId: number, dto: UpdateUserDto) {
    const updateData: Partial<typeof usersTable.$inferInsert> = {
      role: dto.role,
      name: dto.name,
      surname: dto.surname,
      email: dto.email,
      password_hash: dto.password,
      address_line: dto.address_line,
      phone_country_code: dto.phone_code,
      phone_number: dto.phone_number,
    };

    if (dto.location) {
      updateData.country = dto.location.country;
      updateData.city = dto.location.city;
      updateData.district = dto.location.district;
    }

    const [updatedUser] = await this.db.client
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, userId))
      .returning();

    return updatedUser;
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

  async findAllByCompanyId(companyId: number) {
    const employees = await this.db.client
      .select({
        id: usersTable.id,
        name: usersTable.name,
        role: usersTable.role,
        status: usersTable.status,
      })
      .from(usersTable)
      .where(eq(usersTable.company_id, companyId))
      .limit(10);

    return employees;
  }

  async findEmployeesByCompanyId(companyId: number) {
    const [{ count: totalEmployees }] = await this.db.client
      .select({
        count: count(),
      })
      .from(usersTable)
      .where(eq(usersTable.company_id, companyId));

    return totalEmployees;
  }
}
