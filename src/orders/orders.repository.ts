import { Injectable, NotFoundException } from '@nestjs/common';
import {
  and,
  count,
  desc,
  eq,
  inArray,
  isNull,
  sql,
  type SQL,
} from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { PaginatedResponse } from 'src/common/types';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import type { OrderListItem } from './dto/order-list-item.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';

import { calculatePagination } from 'src/common/utils/pagination.util';
import { DbService } from 'src/db/db.service';
import {
  branchesTable,
  clientPassportsTable,
  clientsTable,
  companiesTable,
  ordersTable,
  shipmentsTable,
} from 'src/db/schema';
import { TripsStopsOrdersDto } from 'src/trips/dto/trips-stops-orders.dto';
import { OrdersStatus } from './dto/orders-statuses';

@Injectable()
export class OrdersRepository {
  constructor(
    private readonly db: DbService,
    private readonly itemsRep: OrderItemsRepository,
  ) {}

  async findAll(
    filters: OrdersQueryDto,
    companyId: number | undefined,
  ): Promise<PaginatedResponse<OrderListItem>> {
    const page = filters.page;
    const limit = 10;
    const offset = (page - 1) * limit;

    const sender = alias(clientsTable, 'sender');
    const receiver = alias(clientsTable, 'receiver');

    const shipment_id = filters.shipment_id;

    const whereConditions: SQL[] = [];

    if (companyId) {
      whereConditions.push(eq(ordersTable.company_id, companyId));
    }

    if (shipment_id) {
      whereConditions.push(eq(ordersTable.shipment_id, shipment_id));
    }

    const orders: OrderListItem[] = await this.db.client
      .select({
        id: ordersTable.id,
        shipment_id: ordersTable.shipment_id,
        company_name: companiesTable.name,

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
      .innerJoin(companiesTable, eq(ordersTable.company_id, companiesTable.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(ordersTable.id))
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(ordersTable)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    return {
      data: orders,
      pagination: calculatePagination(page, total, limit),
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

  async getSummary(orderId: number) {
    const [orderSummary] = await this.db.client
      .select({
        total_amount: ordersTable.total_amount,
        extra_fee: ordersTable.extra_fee,
        prepaid_amount: ordersTable.prepaid_amount,
        air_kg_price: ordersTable.weight_kg,
        rate_per_kg: ordersTable.rate_per_kg,
        balance:
          sql<string>`(${ordersTable.total_amount} - ${ordersTable.prepaid_amount})::text`.mapWith(
            String,
          ),
      })
      .from(ordersTable)
      .where(eq(ordersTable.id, orderId));

    return orderSummary;
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
      company_id: number;
      to_country: string;
      to_city: string;
    },
    dbOrTx = this.db.client,
  ) {
    const [row] = await dbOrTx
      .insert(ordersTable)
      .values({
        ...values,
      })
      .returning({ order_id: ordersTable.id });

    return row.order_id;
  }

  async syncBranchesWithPartner(
    shipmentIds: number[],
    partnerId: number,
    dbOrTx = this.db.client,
  ) {
    return await dbOrTx
      .update(ordersTable)
      .set({
        destination_branch_id: sql`(
          SELECT ${branchesTable.id}
          FROM ${branchesTable}
          WHERE ${branchesTable.company_id} = ${partnerId}
            AND ${branchesTable.city} = ${ordersTable.to_city}
            AND ${branchesTable.is_active} = true
          LIMIT 1
        )`,
      })
      .where(inArray(ordersTable.shipment_id, shipmentIds));
  }

  async findFirstOrphanOrder(shipmentIds: number[], dbOrTx = this.db.client) {
    const [orphan] = await dbOrTx
      .select({
        id: ordersTable.id,
        city: ordersTable.to_city,
      })
      .from(ordersTable)
      .where(
        and(
          inArray(ordersTable.shipment_id, shipmentIds),
          isNull(ordersTable.destination_branch_id),
        ),
      )
      .limit(1);

    return orphan ?? null;
  }

  async updateStatusByShipmentIds(
    shipmentId: number[],
    ordersStatus: OrdersStatus,
    dbOrTx = this.db.client,
  ) {
    await dbOrTx
      .update(ordersTable)
      .set({ status: ordersStatus })
      .where(inArray(ordersTable.shipment_id, shipmentId));
  }

  async findGroupCityByFlightId(flightId: number, dbOrTx = this.db.client) {
    const data = await dbOrTx
      .select({
        branch_id: ordersTable.destination_branch_id,
        to_city: ordersTable.to_city,
        orders_count: sql<string>`count(${ordersTable.id})`,
        total_prepaid: sql<string>`coalesce(sum(${ordersTable.prepaid_amount}), 0)`,
        total_remaining: sql<string>`coalesce(sum(${ordersTable.total_amount}) - sum(${ordersTable.prepaid_amount}), 0)`,
        total_weight: sql<string>`coalesce(sum(${ordersTable.weight_kg}), 0)`,
      })
      .from(ordersTable)
      .innerJoin(shipmentsTable, eq(ordersTable.shipment_id, shipmentsTable.id))
      .where(eq(shipmentsTable.flight_id, flightId))
      .groupBy(ordersTable.to_city, ordersTable.destination_branch_id);

    return data;
  }

  async findDistributionByFlightId(flightId: number) {
    return await this.db.client
      .select({
        branch_id: ordersTable.destination_branch_id,
        to_city: ordersTable.to_city,
        orders_count: sql<string>`count(${ordersTable.id})`,
        total_prepaid: sql<string>`coalesce(sum(${ordersTable.prepaid_amount}), 0)`,
        total_remaining: sql<string>`coalesce(sum(${ordersTable.total_amount}) - sum(${ordersTable.prepaid_amount}), 0)`,
        total_weight: sql<string>`coalesce(sum(${ordersTable.weight_kg}), 0)`,
      })
      .from(ordersTable)
      .innerJoin(shipmentsTable, eq(ordersTable.shipment_id, shipmentsTable.id))
      .where(
        and(
          eq(shipmentsTable.flight_id, flightId),
          isNull(ordersTable.trip_id),
        ),
      )
      .groupBy(ordersTable.to_city, ordersTable.destination_branch_id);
  }

  async linkOrdersToTrip(
    flightId: number,
    tripId: number,
    branchIds: number[],
    dbOrTx = this.db.client,
  ) {
    const shipmentsSubquery = dbOrTx
      .select({ id: shipmentsTable.id })
      .from(shipmentsTable)
      .where(eq(shipmentsTable.flight_id, flightId));

    await dbOrTx
      .update(ordersTable)
      .set({
        trip_id: tripId,
      })
      .where(
        and(
          inArray(ordersTable.shipment_id, shipmentsSubquery),
          inArray(ordersTable.destination_branch_id, branchIds),
          isNull(ordersTable.trip_id),
        ),
      );
  }

  async findByBranchAndTrip(
    tripId: number,
    branchId: number,
    filters: TripsStopsOrdersDto,
  ): Promise<PaginatedResponse> {
    const { page } = filters;
    const limit = 10;
    const offset = (page - 1) * limit;

    const orders = await this.db.client
      .select({
        id: ordersTable.id,
        receiver_name: clientsTable.name,
        weight_kg: ordersTable.weight_kg,
        remaining: sql<string>`${ordersTable.total_amount} - ${ordersTable.prepaid_amount}`,
        status: ordersTable.status,
      })
      .from(ordersTable)
      .innerJoin(clientsTable, eq(clientsTable.id, ordersTable.receiver_id))
      .where(
        and(
          eq(ordersTable.trip_id, tripId),
          eq(ordersTable.destination_branch_id, branchId),
        ),
      )
      .limit(limit)
      .offset(offset);

    const [{ count: total }] = await this.db.client
      .select({ count: count() })
      .from(ordersTable)
      .where(
        and(
          eq(ordersTable.trip_id, tripId),
          eq(ordersTable.destination_branch_id, branchId),
        ),
      );

    return { data: orders, pagination: calculatePagination(page, total) };
  }

  async createOrdersForSeed(
    shipments: { id: number; company_id: number }[],
    dbOrTx = this.db.client,
  ): Promise<number[]> {
    const ORDERS_PER_SHIPMENT = 10;
    const totalOrders = shipments.length * ORDERS_PER_SHIPMENT;
    const totalClients = totalOrders * 2;

    const randomDigits = (length: number) =>
      Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');

    const UZ_LOCATIONS = [
      {
        code: 'tas',
        districts: [
          'Chilanzar',
          'Yunusabad',
          'Mirzo Ulugbek',
          'Yakkasaray',
          'Sergeli',
        ],
      },
      {
        code: 'skd',
        districts: ['Pastdargom', 'Bulungur', 'Taylak', 'Jomboy', 'Ishtixon'],
      },
      {
        code: 'bhk',
        districts: ['Gijduvan', 'Kagan', 'Shofirkon', 'Vobkent', 'Jondor'],
      },
      {
        code: 'nma',
        districts: ['Pap', 'Chust', 'Chartak', 'Uychi', 'Uchkurgan'],
      },
    ];

    // Распределение на 10 заказов: 3-TAS, 3-SKD, 2-BHK, 2-NMA
    const citySequence = [
      'tas',
      'tas',
      'tas',
      'skd',
      'skd',
      'skd',
      'bhk',
      'bhk',
      'nma',
      'nma',
    ];

    // 1. СОЗДАЕМ КЛИЕНТОВ
    const createdClients = await dbOrTx
      .insert(clientsTable)
      .values(
        Array.from({ length: totalClients }).map((_, i) => {
          const isReceiver = i % 2 === 1;

          if (isReceiver) {
            const orderIndexInBatch = Math.floor((i % 20) / 2);
            const cityCode = citySequence[orderIndexInBatch];
            const location = UZ_LOCATIONS.find((l) => l.code === cityCode);
            const districts = location?.districts || ['Center'];
            const randomDistrict =
              districts[Math.floor(Math.random() * districts.length)];

            return {
              name: `RecName${i}`,
              surname: `RecSurname${i}`,
              country: 'uz',
              city: cityCode,
              district: randomDistrict,
              phone_country_code: '998',
              phone_number: `90${randomDigits(7)}`,
              // Если в схеме нет поля inn, Drizzle может ругнуться — проверь схему!
              // inn: randomDigits(9),
            };
          }

          // Отправитель (Турция)
          return {
            name: `SendName${i}`,
            surname: `SendSurname${i}`,
            country: 'tr',
            city: 'ist',
            district: 'Fatih',
            phone_country_code: '90',
            phone_number: `555${randomDigits(7)}`,
            // inn: randomDigits(10),
          };
        }),
      )
      .returning({
        id: clientsTable.id,
        country: clientsTable.country,
        city: clientsTable.city,
      });

    // 2. СОЗДАЕМ ПАСПОРТА (Уникальность через i + случайные символы)
    const passportsToInsert = createdClients.map((client, i) => {
      const prefix = client.country.toUpperCase();
      const randomSalt = Math.random()
        .toString(36)
        .substring(2, 5)
        .toUpperCase();

      return {
        client_id: client.id,
        // Пример: TR7A91234
        passport_number: `${prefix}${randomSalt}${randomDigits(4)}`.slice(0, 9),
        // ПИНФЛ: ровно 14 цифр. Хвост из индекса i гарантирует уникальность в базе.
        national_id: `${randomDigits(10)}${i.toString().padStart(4, '0')}`,
        country: client.country,
        status: 'active' as const,
        is_primary: true,
      };
    });

    await dbOrTx.insert(clientPassportsTable).values(passportsToInsert);

    // 3. СОЗДАЕМ ЗАКАЗЫ (Mapping клиентов на отправки)
    let clientIdx = 0;
    const ordersToInsert = shipments.flatMap((shipment) => {
      return Array.from({ length: ORDERS_PER_SHIPMENT }).map(() => {
        const sender = createdClients[clientIdx++];
        const receiver = createdClients[clientIdx++];

        const weight = (Math.random() * 29 + 1).toFixed(2);
        const rate = '6.50';
        const extraFee = '5.00';
        const subtotal = (parseFloat(weight) * parseFloat(rate)).toFixed(2);
        const total = (parseFloat(subtotal) + parseFloat(extraFee)).toFixed(2);
        const randomPercent = Math.random() * 0.8 + 0.2;
        const prepaidAmount = (parseFloat(total) * randomPercent).toFixed(2);

        return {
          company_id: shipment.company_id,
          shipment_id: shipment.id,
          sender_id: sender.id,
          receiver_id: receiver.id,
          to_country: 'uz',
          to_city: receiver.city,
          weight_kg: weight,
          rate_per_kg: rate,
          prepaid_amount: prepaidAmount,
          subtotal: subtotal,
          total_amount: total,
          extra_fee: extraFee,
          status: 'received' as const,
        };
      });
    });

    const createdOrders = await dbOrTx
      .insert(ordersTable)
      .values(ordersToInsert)
      .returning({ id: ordersTable.id });

    return createdOrders.map((o) => o.id);
  }
}
