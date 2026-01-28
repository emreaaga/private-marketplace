import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { companiesTable, servicesTable } from 'src/db/schema';
import { InferInsertModel, eq, and, type SQL } from 'drizzle-orm';
import { FindServicesQueryDto } from './dto';

export type ServiceInsert = InferInsertModel<typeof servicesTable>;

@Injectable()
export class ServicesRepository {
  constructor(private readonly dbService: DbService) {}

  // Должен добавить пагинацию
  async findAll(filters: FindServicesQueryDto) {
    const { company_id, type, pricing_type } = filters;

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
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return services;
  }

  async create(dto: ServiceInsert) {
    await this.dbService.client.insert(servicesTable).values(dto);
  }
}
