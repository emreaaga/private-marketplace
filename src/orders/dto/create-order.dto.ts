import { ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateClientDto } from 'src/clients/dto/create-client.dto';
import { CreateOrderItem } from 'src/order-items/dto/create-order-items.dto';
import { OrderSummaryDto } from './order-summary.dto';

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CreateClientDto)
  sender: CreateClientDto;

  @ValidateNested()
  @Type(() => CreateClientDto)
  receiver: CreateClientDto;

  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItem)
  order_items: CreateOrderItem[];

  @ValidateNested()
  @Type(() => OrderSummaryDto)
  summary: OrderSummaryDto;
}
