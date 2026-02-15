import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { companiesTable, servicesTable } from 'src/db/schema';
import { InferInsertModel, eq, and, type SQL, count, desc } from 'drizzle-orm';
import { FindServicesQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

export type ServiceInsert = InferInsertModel<typeof servicesTable>;

@Injectable()
export class ServicesRepository {
  constructor(private readonly dbService: DbService) {}

  async findAll(filters: FindServicesQueryDto): Promise<PaginatedResponse> {
    const { company_id, type, pricing_type, page } = filters;
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [];

    if (company_id) {
      whereConditions.push(eq(servicesTable.company_id, company_id));
    }

    if (type) {
      whereConditions.push(eq(servicesTable.type, type));
    }

    if (pricing_type) {
      whereConditions.push(eq(servicesTable.pricing_type, pricing_type));
    }

    const services = await this.dbService.client
      .select({
        id: servicesTable.id,
        company_id: companiesTable.id,
        company_name: companiesTable.name,
        company_type: companiesTable.type,
        type: servicesTable.type,
        pricing_type: servicesTable.pricing_type,
        price: servicesTable.price,
        is_active: servicesTable.is_active,
      })
      .from(servicesTable)
      .leftJoin(companiesTable, eq(servicesTable.company_id, companiesTable.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(servicesTable.created_at), desc(servicesTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.dbService.client
      .select({ count: count() })
      .from(servicesTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalPages = Math.ceil(total / limit);

    return {
      data: services,
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

  async create(dto: ServiceInsert) {
    await this.dbService.client.insert(servicesTable).values(dto);
  }
}
