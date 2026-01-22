import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { companiesTable } from 'src/db/schema';
import { CreateCompanyDto } from './dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class CompaniesRepository {
  constructor(private readonly db: DbService) {}

  async findAll() {
    const companies = await this.db.client.select().from(companiesTable);
    return companies;
  }

  async create(dto: CreateCompanyDto) {
    await this.db.client.insert(companiesTable).values(dto);
  }

  async deleteOne(id: number) {
    await this.db.client
      .delete(companiesTable)
      .where(eq(companiesTable.id, id));
  }
}
