import { Injectable, NotFoundException } from '@nestjs/common';
import Big from 'big.js';

import { BranchesRepository } from 'src/branches/branches.repository';
import { ClientsRepository } from 'src/clients/clients.repository';
import { PaginatedResponse } from 'src/common/types';
import { type AllCompanyType } from 'src/companies/dto/company-type';
import { DbService } from 'src/db/db.service';
import { FinancialEventsRepository } from 'src/financial-events/financial-events.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { ShipmentsStatus } from 'src/shipments/dto';
import { ShipmentsRepository } from 'src/shipments/shipments.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersQueryDto } from './dto/orders-query.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly db: DbService,
    private readonly ordersRepo: OrdersRepository,
    private readonly itemsRepo: OrderItemsRepository,
    private readonly clientsRepo: ClientsRepository,
    private readonly fEventrepo: FinancialEventsRepository,
    private readonly shipmentsRep: ShipmentsRepository,
    private readonly branchesRep: BranchesRepository,
  ) {}

  async findAll(
    dto: OrdersQueryDto,
    companyId: number,
    companyType: AllCompanyType,
  ): Promise<PaginatedResponse> {
    let shipmentStatus: ShipmentsStatus | undefined;

    if (dto.shipment_id) {
      const status = await this.shipmentsRep.findStatusById(dto.shipment_id);

      if (!status) {
        throw new NotFoundException('Отправка  не найдена');
      }

      shipmentStatus = status;
    }

    let targetCompanyId: number | undefined;

    if (companyType === 'postal') {
      targetCompanyId = companyId;
    }

    const result = await this.ordersRepo.findAll(dto, targetCompanyId);

    return {
      ...result,
      shipment_status: shipmentStatus,
      data: result.data.map((o) => ({
        id: o.id,
        internal_number: o.internal_number,

        company_name: o.company_name,
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

  async create(
    dto: CreateOrderDto,
    companyType: AllCompanyType,
    currentCompanyId: number,
  ) {
    let targetCompanyId = currentCompanyId;

    if (companyType === 'platform') {
      const foundCid = await this.shipmentsRep.findCidByShipmentId(
        dto.summary.shipment_id,
      );

      if (!foundCid) {
        throw new NotFoundException('Отправка не найдена');
      }

      targetCompanyId = foundCid;
    }

    return this.db.client.transaction(async (tx) => {
      const senderId = await this.clientsRepo.createWithPassport(
        dto.sender,
        tx,
      );
      const receiverId = await this.clientsRepo.createWithPassport(
        dto.receiver,
        tx,
      );

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
          company_id: targetCompanyId,
          to_country: dto.receiver.country,
          to_city: dto.receiver.city,
        },
        tx,
      );

      if (new Big(extraFee).gt(0)) {
        await this.fEventrepo.create(
          orderId,
          'additional',
          extraFee,
          'Допплата от клиента',
          tx,
        );
      }

      if (new Big(deposit).gt(0)) {
        await this.fEventrepo.create(
          orderId,
          'prepayment',
          deposit,
          'Предоплата от клиента',
          tx,
        );
      }

      await this.itemsRepo.createMany(orderId, items, tx);

      return { order_id: orderId };
    });
  }

  async getSummary(orderId: number) {
    const data = await this.ordersRepo.getSummary(orderId);
    return data;
  }
}
