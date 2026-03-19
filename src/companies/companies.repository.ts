import { Injectable } from '@nestjs/common';
import { and, count, desc, eq, ne } from 'drizzle-orm';
import { PaginatedResponse } from 'src/common/types';
import { DbService } from 'src/db/db.service';
import { companiesTable } from 'src/db/schema';
import {
  CompaniesLookupQueryDto,
  CompaniesQueryDto,
  CompanyType,
  CompanyUpdateDto,
  CreateCompanyDto,
} from './dto';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly db: DbService) {}

  async findAll(filters: CompaniesQueryDto): Promise<PaginatedResponse> {
    const limit = 10;
    const page = filters.page;
    const offset = (page - 1) * limit;

    const whereCondition = filters.type
      ? eq(companiesTable.type, filters.type)
      : ne(companiesTable.type, 'platform');

    const companies = await this.db.client
      .select()
      .from(companiesTable)
      .where(whereCondition)
      .orderBy(desc(companiesTable.created_at), desc(companiesTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(companiesTable)
      .where(whereCondition);

    const totalPages = Math.ceil(total / limit);

    return {
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async lookup(filters: CompaniesLookupQueryDto): Promise<object> {
    const whereCondition = filters.type
      ? eq(companiesTable.type, filters.type)
      : ne(companiesTable.type, 'platform');

    const companies = await this.db.client
      .select({ id: companiesTable.id, name: companiesTable.name })
      .from(companiesTable)
      .where(and(whereCondition, eq(companiesTable.is_active, true)))
      .orderBy(desc(companiesTable.created_at), desc(companiesTable.id))
      .limit(100);

    return companies;
  }

  async create(dto: CreateCompanyDto) {
    await this.db.client.insert(companiesTable).values({
      name: dto.name,
      type: dto.type,
      country: dto.location.country,
      city: dto.location.city,
    });
  }

  async findOne(id: number) {
    const [company] = await this.db.client
      .select({
        id: companiesTable.id,
        name: companiesTable.name,
        type: companiesTable.type,
        country: companiesTable.country,
        city: companiesTable.city,
        is_active: companiesTable.is_active,
        created_at: companiesTable.created_at,
      })
      .from(companiesTable)
      .where(eq(companiesTable.id, id));

    return company;
  }

  async getTotalCount(companyType: CompanyType) {
    const [{ count: totalPostal }] = await this.db.client
      .select({ count: count() })
      .from(companiesTable)
      .where(
        and(
          eq(companiesTable.type, companyType),
          eq(companiesTable.is_active, true),
        ),
      );

    return totalPostal;
  }

  async update(companyId: number, dto: CompanyUpdateDto) {
    const updateData: Partial<typeof companiesTable.$inferInsert> = {
      name: dto.name,
      type: dto.type,
      is_active: dto.is_active,
    };

    if (dto.location) {
      updateData.country = dto.location.country;
      updateData.city = dto.location.city;
    }

    const [updatedCompany] = await this.db.client
      .update(companiesTable)
      .set(updateData)
      .where(eq(companiesTable.id, companyId))
      .returning();

    return updatedCompany;
  }
}
