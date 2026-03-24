import { Injectable } from '@nestjs/common';
import { ClientPassportsRepository } from 'src/client-passports/client-passports.repository';
import { PaginatedResponse } from 'src/common/types';
import { DbService } from 'src/db/db.service';
import { ClientsRepository } from './clients.repository';
import { ClientsQueryDto, CreateClientDto } from './dto';

@Injectable()
export class ClientsService {
  constructor(
    private readonly db: DbService,
    private readonly clientsRepository: ClientsRepository,
    private readonly passRep: ClientPassportsRepository,
  ) {}

  async findAll(dto: ClientsQueryDto): Promise<PaginatedResponse> {
    const clients = await this.clientsRepository.findAll(dto);
    return clients;
  }

  async create(dto: CreateClientDto) {
    return await this.db.client.transaction(async (tx) => {
      const clientId = await this.clientsRepository.create(dto, tx);

      await this.passRep.create(
        clientId,
        dto.identity_document,
        dto.country,
        tx,
      );
    });
  }
}
