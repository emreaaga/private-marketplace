import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedResponse } from 'src/common/types';
import Big from 'big.js';

import { FlightsRepository } from './flights.repository';
import { CreateFlightDto, FlightsQueryDto } from './dto';
import { FlightExpensesRepository } from 'src/flight-expenses/flight-expenses.repository';
import { ShipmentsRepository } from 'src/shipments/shipments.repository';
import { DbService } from 'src/db/db.service';

@Injectable()
export class FlightsService {
  constructor(
    private readonly db: DbService,
    private readonly flightsRepository: FlightsRepository,
    private readonly flightExpensesRep: FlightExpensesRepository,
    private readonly shipmentsRep: ShipmentsRepository,
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
        throw new Error('Некоторые отправки не были найдены или обновлены');
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

  async findAll(dto: FlightsQueryDto): Promise<PaginatedResponse> {
    const data = await this.flightsRepository.findAll(dto);
    return data;
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

    const total = shipments.reduce((sum, shipment) => {
      const currentWeight = new Big(shipment.total_weight_kg || 0);
      return sum.plus(currentWeight);
    }, new Big(0));

    return {
      ...flight,
      shipments,
      total_flight_weight_kg: total.toFixed(2),
    };
  }
}
