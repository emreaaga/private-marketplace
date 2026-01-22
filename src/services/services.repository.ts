import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { companiesTable, servicesTable } from 'src/db/schema';
import { eq } from 'drizzle-orm';
import { InferInsertModel } from 'drizzle-orm';

export type ServiceInsert = InferInsertModel<typeof servicesTable>;

@Injectable()
export class ServicesRepository {
  constructor(private readonly dbService: DbService) {}

  // Должен добавить пагинацию
  async findAll() {
    const services = await this.dbService.client
      .select({
        id: servicesTable.id,
        company_name: companiesTable.name,
        company_type: companiesTable.type,
        type: servicesTable.type,
        pricing_type: servicesTable.pricing_type,
        price: servicesTable.price,
        is_active: servicesTable.is_active,
      })
      .from(servicesTable)
      .leftJoin(
        companiesTable,
        eq(servicesTable.company_id, companiesTable.id),
      );

    return services;
  }

  async create(dto: ServiceInsert) {
    await this.dbService.client.insert(servicesTable).values(dto);
  }
}
