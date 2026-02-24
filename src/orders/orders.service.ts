import { Injectable } from '@nestjs/common';
import Big from 'big.js';

import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientsRepository } from 'src/clients/clients.repository';
import { DbService } from 'src/db/db.service';
import { PaginatedResponse } from 'src/common/types';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DbService,
    private readonly ordersRepo: OrdersRepository,
    private readonly itemsRepo: OrderItemsRepository,
    private readonly clientsRepo: ClientsRepository,
  ) {}

  async findAll(dto: OrdersQueryDto): Promise<PaginatedResponse> {
    const result = await this.ordersRepo.findAll(dto);

    return {
      ...result,
      data: result.data.map((o) => ({
        id: o.id,
        sender_name: o.sender_name,
        receiver_name: o.receiver_name,
        weight_kg: o.weight_kg,
        rate_per_kg: o.rate_per_kg,
        prepaid_amount: o.prepaid_amount,
        extra_fee: o.extra_fee,
        balance: new Big(o.total_amount).minus(o.prepaid_amount).toFixed(2),
        status: o.status,
        created_at: o.created_at,
      })),
    };
  }

  async findOne(orderId: number) {
    const order = await this.ordersRepo.findOne(orderId);

    const { sender_id, receiver_id, ...summary } = order;

    const [sender, receiver, orderItems] = await Promise.all([
      this.clientsRepo.findOneWithPassports(sender_id),
      this.clientsRepo.findOneWithPassports(receiver_id),
      this.itemsRepo.findByOrderId(orderId),
    ]);

    return { sender, receiver, orderItems, summary };
  }

  async create(dto: CreateOrderDto) {
    return this.db.client.transaction(async (tx) => {
      const senderId = await this.clientsRepo.create(dto.sender, tx);
      const receiverId = await this.clientsRepo.create(dto.receiver, tx);

      const items = dto.order_items.map((i) => ({
        name: i.name,
        category: null,
        quantity: i.quantity,
        unit_price: i.unit_price,
      }));

      const weight = dto.summary.weight_kg;
      const rate = dto.summary.rate_per_kg;
      const extraFee = dto.summary.extra_fee;
      const deposit = dto.summary.deposit;

      const subtotal = new Big(weight).times(rate).toFixed(2);
      const total = new Big(subtotal).plus(extraFee).toFixed(2);

      const orderId = await this.ordersRepo.create(
        {
          shipment_id: dto.summary.shipment_id,
          sender_id: senderId,
          receiver_id: receiverId,
          weight_kg: new Big(weight).toFixed(2),
          rate_per_kg: new Big(rate).toFixed(2),
          subtotal,
          prepaid_amount: new Big(deposit).toFixed(2),
          total_amount: total,
          extra_fee: extraFee,
        },
        tx,
      );

      await this.itemsRepo.createMany(orderId, items, tx);

      return { order_id: orderId };
    });
  }
}
