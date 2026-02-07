import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { ordersTable } from 'src/db/schema';

@Injectable()
export class OrdersRepository {
  constructor(private readonly db: DbService) {}

  async findAll() {
    const orders = await this.db.client.select().from(ordersTable);

    return orders;
  }

  async create() {}
}
