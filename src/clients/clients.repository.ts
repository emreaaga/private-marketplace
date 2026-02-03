import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { clientsTable, clientPassportsTable } from 'src/db/schema';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsRepository {
  constructor(private readonly db: DbService) {}

  async findAll() {
    const clients = await this.db.client.select().from(clientsTable);
    return clients;
  }

  async create(dto: CreateClientDto) {
    await this.db.client.transaction(async (tx) => {
      const [createdClientId] = await tx
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

      await tx.insert(clientPassportsTable).values(
        dto.passports.map((passport) => ({
          client_id: createdClientId.client_id,
          country: dto.country,
          passport_number: passport.passport_number,
        })),
      );
    });
  }
}
