import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { financialEventsTable } from 'src/db/schema';
import type { FinancialEventsQueryDto, FinancialEventType } from './dto';
import { eq, count, desc } from 'drizzle-orm';
import { PaginatedResponse } from 'src/common/types';

@Injectable()
export class FinancialEventsRepository {
  constructor(private readonly db: DbService) {}

  async create(
    orderId: number,
    financeType: FinancialEventType,
    amount: string,
    description: string = '',
    dbOrTx = this.db.client,
  ) {
    await dbOrTx.insert(financialEventsTable).values({
      order_id: orderId,
      type: financeType,
      amount,
      description: description,
    });
  }

  async findAll(dto: FinancialEventsQueryDto): Promise<PaginatedResponse> {
    const { order_id, page } = dto;
    const limit = 10;
    const offset = (page - 1) * limit;

    const fEvents = await this.db.client
      .select({
        id: financialEventsTable.id,
        type: financialEventsTable.type,
        amount: financialEventsTable.amount,
        description: financialEventsTable.description,
        created_at: financialEventsTable.created_at,
      })
      .from(financialEventsTable)
      .where(eq(financialEventsTable.order_id, order_id))
      .orderBy(desc(financialEventsTable.created_at))
      .offset(offset)
      .limit(limit);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(financialEventsTable)
      .where(eq(financialEventsTable.order_id, order_id));

    const totalPages = Math.ceil(total / limit);

    return {
      data: fEvents,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < total,
        hasPrev: page > 1,
      },
    };
  }
}
