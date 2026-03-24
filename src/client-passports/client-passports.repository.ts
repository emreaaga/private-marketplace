import { Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { clientPassportsTable } from 'src/db/schema';
import { CreateClientPassportDto } from './dto/create-passport.dto';

@Injectable()
export class ClientPassportsRepository {
  constructor(private readonly db: DbService) {}

  async create(
    clientId: number,
    identityDocument: CreateClientPassportDto,
    country: string,
    dbOrTx = this.db.client,
  ) {
    await dbOrTx.insert(clientPassportsTable).values({
      client_id: clientId,
      country: country,
      passport_number: identityDocument.passport_number,
      national_id: identityDocument.national_id,
    });
  }

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

  async findByClientId(client_id: number) {
    const [clientPassports] = await this.db.client
      .select({
        passport_number: clientPassportsTable.passport_number,
        national_id: clientPassportsTable.national_id,
      })
      .from(clientPassportsTable)
      .where(eq(clientPassportsTable.client_id, client_id))
      .orderBy(desc(clientPassportsTable.id))
      .limit(1);

    return clientPassports;
  }
}
