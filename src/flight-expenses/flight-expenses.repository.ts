import { Injectable } from '@nestjs/common';
import { SQL, eq, count, and, sql } from 'drizzle-orm';

import { DbService } from 'src/db/db.service';
import { flightExpensesTable } from 'src/db/schema';
import { FlightExpensesQueryDto, FlightExpensesType } from './dto';
import { PaginatedResponse } from 'src/common/types';
import { DbTransaction } from 'src/db/db.types';

@Injectable()
export class FlightExpensesRepository {
  constructor(private readonly db: DbService) {}

  async create(
    flightId: number,
    expensesType: FlightExpensesType,
    amount: string,
    description: string = '',
    tx?: DbTransaction,
  ) {
    const db = tx ?? this.db.client;

    await db.insert(flightExpensesTable).values({
      flight_id: flightId,
      type: expensesType,
      amount: amount,
      description: description,
    });
  }

  async findAll(filters: FlightExpensesQueryDto): Promise<PaginatedResponse> {
    const { flight_id, page } = filters;
    const limit = 10;
    const offset = (page - 1) * limit;

    const whereCondition: SQL[] = [];

    if (flight_id) {
      whereCondition.push(eq(flightExpensesTable.flight_id, flight_id));
    }

    const expenses = await this.db.client
      .select({
        id: flightExpensesTable.id,
        type: flightExpensesTable.type,
        amount: flightExpensesTable.amount,
        description: flightExpensesTable.description,
      })
      .from(flightExpensesTable)
      .where(whereCondition.length > 0 ? and(...whereCondition) : undefined)
      .limit(limit)
      .offset(offset);

    if (expenses.length === 0 && page === 1) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(flightExpensesTable)
      .where(whereCondition.length > 0 ? and(...whereCondition) : undefined);

    const totalPages = Math.ceil(total / limit);

    return {
      data: expenses,
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

  async getTotalExpensesByFlightId(flightId: number) {
    const [result] = await this.db.client
      .select({
        total: sql<string>`COALESCE(SUM(${flightExpensesTable.amount}), 0)`,
      })
      .from(flightExpensesTable)
      .where(eq(flightExpensesTable.flight_id, flightId));

    return result.total || '0';
  }
}
