import { Injectable } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { clientPassportsTable } from 'src/db/schema';

@Injectable()
export class ClientPassportsRepository {
  constructor(private readonly db: DbService) {}

  async findClientIdByPassport(
    passportNumber: string,
    country: string,
  ): Promise<number | null> {
    const [row] = await this.db.client
      .select({ client_id: clientPassportsTable.client_id })
      .from(clientPassportsTable)
      .where(
        and(
          eq(clientPassportsTable.passport_number, passportNumber),
          eq(clientPassportsTable.country, country),
        ),
      )
      .limit(1);

    return row?.client_id ?? null;
  }
}
