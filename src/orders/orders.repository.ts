import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, count, type SQL, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { PaginatedResponse } from 'src/common/types';
import type { OrderListItem } from './dto/order-list-item.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';

import { DbService } from 'src/db/db.service';
import { clientsTable, ordersTable } from 'src/db/schema';

@Injectable()
export class OrdersRepository {
  constructor(
    private readonly db: DbService,
    private readonly itemsRep: OrderItemsRepository,
  ) {}

  async findAll(
    filters: OrdersQueryDto,
  ): Promise<PaginatedResponse<OrderListItem>> {
    const page = filters.page;
    const limit = 10;
    const offset = (page - 1) * limit;

    const sender = alias(clientsTable, 'sender');
    const receiver = alias(clientsTable, 'receiver');

    const shipment_id = filters.shipment_id;

    const whereConditions: SQL[] = [];

    if (shipment_id) {
      whereConditions.push(eq(ordersTable.shipment_id, shipment_id));
    }

    const orders: OrderListItem[] = await this.db.client
      .select({
        id: ordersTable.id,
        shipment_id: ordersTable.shipment_id,

        sender_name: sender.name,
        receiver_name: receiver.name,

        weight_kg: ordersTable.weight_kg,
        rate_per_kg: ordersTable.rate_per_kg,
        total_amount: ordersTable.total_amount,
        prepaid_amount: ordersTable.prepaid_amount,
        extra_fee: ordersTable.extra_fee,

        status: ordersTable.status,
        created_at: ordersTable.created_at,
      })
      .from(ordersTable)
      .innerJoin(sender, eq(ordersTable.sender_id, sender.id))
      .innerJoin(receiver, eq(ordersTable.receiver_id, receiver.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(ordersTable.created_at))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(ordersTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const totalPages = Math.ceil(total / limit);

    return {
      data: orders,
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

  async findOne(orderId: number) {
    const [order] = await this.db.client
      .select({
        sender_id: ordersTable.sender_id,
        receiver_id: ordersTable.receiver_id,
        prepaid_amount: ordersTable.prepaid_amount,
        extra_fee: ordersTable.extra_fee,
        rate_per_kg: ordersTable.rate_per_kg,
        shipment_id: ordersTable.shipment_id,
        weight_kg: ordersTable.weight_kg,
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId))
      .limit(1);

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    return order;
  }

  async create(
    values: {
      shipment_id: number;
      sender_id: number;
      receiver_id: number;
      weight_kg: string;
      rate_per_kg: string;
      subtotal: string;
      prepaid_amount: string;
      total_amount: string;
      extra_fee: string;
    },
    dbOrTx = this.db.client,
  ) {
    const [row] = await dbOrTx
      .insert(ordersTable)
      .values(values)
      .returning({ order_id: ordersTable.id });

    return row.order_id;
  }
}
