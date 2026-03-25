import { Injectable } from '@nestjs/common';
import { desc, eq, sql } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { branchesTable } from 'src/db/schema';

@Injectable()
export class BranchesRepository {
  constructor(private readonly db: DbService) {}

  async findAllByCompany(companyId: number) {
    const data = await this.db.client
      .select({
        id: branchesTable.id,
        companyId: branchesTable.company_id,
        name: branchesTable.name,
        country: branchesTable.country,
        city: branchesTable.city,
        is_main: branchesTable.is_main,
        is_active: branchesTable.is_active,
      })
      .from(branchesTable)
      .where(eq(branchesTable.company_id, companyId))
      .orderBy(desc(branchesTable.created_at), desc(branchesTable.id));

    return data;
  }

  async lookup(companyId: number) {
    const data = await this.db.client
      .select({
        id: branchesTable.id,
        name: branchesTable.name,
        route: sql<string>`upper(${branchesTable.country}) || '→' || upper(${branchesTable.city})`,
      })
      .from(branchesTable)
      .where(eq(branchesTable.company_id, companyId))
      .orderBy(desc(branchesTable.created_at), desc(branchesTable.id));

    return data;
  }

  async create(
    companyId: number,
    brancheName: string,
    branchCountry: string,
    branchCity: string,
    isMain: boolean = false,
    dbOrTx = this.db.client,
  ) {
    await dbOrTx.insert(branchesTable).values({
      company_id: companyId,
      name: brancheName,
      country: branchCountry,
      city: branchCity,
      is_main: isMain,
    });
  }
}
