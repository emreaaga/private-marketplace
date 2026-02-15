import { Injectable } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { CreateClientDto, ClientsQueryDto } from './dto';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async findAll(dto: ClientsQueryDto): Promise<PaginatedResponse> {
    const clients = await this.clientsRepository.findAll(dto);
    return clients;
  }

  async create(dto: CreateClientDto) {
    await this.clientsRepository.create(dto);
  }
}
