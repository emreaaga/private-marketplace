import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DbService } from 'src/db/db.service';
import { orderItemsTable } from 'src/db/schema';

@Injectable()
export class OrderItemsRepository {
  constructor(private readonly db: DbService) {}

  async findByOrderId(orderId: number) {
    const orderItems = await this.db.client
      .select({
        name: orderItemsTable.name,
        quantity: orderItemsTable.quantity,
        unit_price: orderItemsTable.unit_price,
      })
      .from(orderItemsTable)
      .where(eq(orderItemsTable.order_id, orderId));

    return orderItems;
  }

  async createMany(
    orderId: number,
    items: Array<{
      name: string;
      category?: 'clothes' | 'electronics' | null;
      quantity: number;
      unit_price: string;
    }>,
    dbOrTx = this.db.client,
  ) {
    if (!items.length) return;

    await dbOrTx.insert(orderItemsTable).values(
      items.map((i) => ({
        order_id: orderId,
        name: i.name,
        category: i.category ?? null,
        quantity: i.quantity,
        unit_price: i.unit_price,
      })),
    );
  }
}
