import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async findAll() {
    const orders = await this.ordersRepository.findAll();
    return orders;
  }

  async create() {}
}
