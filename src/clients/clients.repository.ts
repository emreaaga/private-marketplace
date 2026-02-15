import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { clientsTable, clientPassportsTable } from 'src/db/schema';
import { CreateClientDto, ClientsQueryDto } from './dto';
import { desc, count } from 'drizzle-orm';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class ClientsRepository {
  constructor(private readonly db: DbService) {}

  async findAll(filter: ClientsQueryDto): Promise<PaginatedResponse> {
    const page = filter.page;
    const limit = 10;
    const offset = (page - 1) * limit;

    const clients = await this.db.client
      .select()
      .from(clientsTable)
      .orderBy(desc(clientsTable.created_at), desc(clientsTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(clientsTable);

    const totalPages = Math.ceil(total / limit);

    return {
      data: clients,
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

  async create(dto: CreateClientDto, dbOrTx = this.db.client) {
    const [created] = await dbOrTx
      .insert(clientsTable)
      .values({
        name: dto.name,
        surname: dto.surname,
        country: dto.country,
        city: dto.city,
        district: dto.district,
        address_line: dto.address_line,
        phone_country_code: dto.phone_country_code,
        phone_number: dto.phone_number,
      })
      .returning({ client_id: clientsTable.id });

    await dbOrTx.insert(clientPassportsTable).values(
      dto.passports.map((p) => ({
        client_id: created.client_id,
        country: dto.country,
        passport_number: p.passport_number,
      })),
    );

    return created.client_id;
  }
}
