import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import Big from 'big.js';
import { PaginatedResponse } from 'src/common/types';

import { BranchesRepository } from 'src/branches/branches.repository';
import { type AllCompanyType } from 'src/companies/dto/company-type';
import { DbService } from 'src/db/db.service';
import { FlightExpensesRepository } from 'src/flight-expenses/flight-expenses.repository';
import { OrdersRepository } from 'src/orders/orders.repository';
import { ShipmentsRepository } from 'src/shipments/shipments.repository';
import { CreateFlightDto, FlightsQueryDto } from './dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { FlightsRepository } from './flights.repository';

@Injectable()
export class FlightsService {
  constructor(
    private readonly db: DbService,
    private readonly flightsRepository: FlightsRepository,
    private readonly flightExpensesRep: FlightExpensesRepository,
    private readonly shipmentsRep: ShipmentsRepository,
    private readonly branchesRep: BranchesRepository,
    private readonly ordersRep: OrdersRepository,
  ) {}

  async create(dto: CreateFlightDto) {
    return await this.db.client.transaction(async (tx) => {
      const flight = await this.flightsRepository.create(dto, tx);

      const updatedShipments = await this.shipmentsRep.updateShipmentsStatus(
        dto.shipments,
        flight.id,
        'ready',
        tx,
      );

      if (updatedShipments.length !== dto.shipments.length) {
        throw new BadRequestException('Некорректный список отправок');
      }

      await this.ordersRep.syncBranchesWithPartner(
        dto.shipments,
        dto.receiver_customs_id,
        tx,
      );

      const hasOrphans = await this.ordersRep.findFirstOrphanOrder(
        dto.shipments,
        tx,
      );

      if (hasOrphans) {
        throw new BadRequestException(
          `У выбранного партнера нет активного филиала в городе: ${hasOrphans.city}. `,
        );
      }

      const totalWeight = await this.shipmentsRep.getTotalWeightByShipmentIds(
        dto.shipments,
        tx,
      );

      const weight = new Big(totalWeight);
      const price = new Big(dto.air_kg_price);
      const airAmount = weight.times(price).toFixed(2);

      await this.flightExpensesRep.create(
        flight.id,
        'aircraft',
        airAmount,
        `Авто расчет: ${totalWeight} кг x $${dto.air_kg_price}/кг`,
        tx,
      );
    });
  }

  async findAll(
    dto: FlightsQueryDto,
    companyId: number,
    companyType: AllCompanyType,
  ): Promise<PaginatedResponse> {
    if (companyType === 'platform') {
      return await this.flightsRepository.findAllAdmin(dto);
    }

    return await this.flightsRepository.findAllForRole(
      dto,
      companyId,
      companyType,
    );
  }

  async getSummary(flightId: number) {
    const [orderStats, totalExpenses] = await Promise.all([
      this.shipmentsRep.getStatsByFlightId(flightId),
      this.flightExpensesRep.getTotalExpensesByFlightId(flightId),
    ]);

    const revenue = new Big(orderStats?.total_revenue || 0);
    const prepaid = new Big(orderStats?.total_prepaid || 0);
    const expenses = new Big(totalExpenses || 0);

    const remaining = revenue.minus(prepaid);
    const profit = revenue.minus(expenses);

    return {
      revenue: revenue.toFixed(2),
      total_weight: new Big(orderStats?.total_weight || 0).toFixed(2),
      total_prepaid: prepaid.toFixed(2),
      total_remaining: remaining.toFixed(2),
      total_expenses: expenses.toFixed(2),
      total_profit: profit.toFixed(2),
    };
  }

  async findOne(flightId: number) {
    const flight = await this.flightsRepository.findOne(flightId);

    if (!flight) {
      throw new NotFoundException(`Рейс не найден`);
    }

    const shipments = await this.shipmentsRep.findByFlightId(flightId);

    const branches_summary =
      await this.ordersRep.findGroupCityByFlightId(flightId);

    const total = shipments.reduce((sum, shipment) => {
      const currentWeight = new Big(shipment.total_weight_kg || 0);
      return sum.plus(currentWeight);
    }, new Big(0));

    return {
      ...flight,
      shipments,
      branches_summary,
      total_flight_weight_kg: total.toFixed(2),
    };
  }

  async update(flightId: number, dto: UpdateFlightDto) {
    return await this.db.client.transaction(async (tx) => {
      await this.flightsRepository.update(flightId, dto, tx);

      if (dto.shipments && dto.shipments.length > 0) {
        // 2. Если в DTO пришли веса отправок (распределенные на фронте)
      }

      // 3. Можно добавить пересчет расходов (expenses), если изменился вес или цена $/кг
      // Но это уже по желанию бизнес-логики
    });
  }

  async updateStatus(flightId: number) {
    return await this.db.client.transaction(async (tx) => {
      await this.flightsRepository.changeStatus(flightId, 'arrived', tx);

      const updatedShipments = await this.shipmentsRep.updateStatusByFlightId(
        flightId,
        'arrived',
        tx,
      );

      const shipmentIds = updatedShipments.map((s) => s.id);

      if (shipmentIds.length > 0) {
        await this.ordersRep.updateStatusByShipmentIds(
          shipmentIds,
          'arrived',
          tx,
        );
      }
    });
  }
}
