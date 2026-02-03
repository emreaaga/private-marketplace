import { Injectable } from '@nestjs/common';
import { ClientsRepository } from './clients.repository';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientsRepository) {}

  async findAll() {
    const clients = await this.clientsRepository.findAll();
    return clients;
  }

  async create(dto: CreateClientDto) {
    await this.clientsRepository.create(dto);
  }
}
