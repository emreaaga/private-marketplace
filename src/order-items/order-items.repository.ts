import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { orderItemsTable } from 'src/db/schema';

@Injectable()
export class OrderItemsRepository {
  constructor(private readonly db: DbService) {}

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
