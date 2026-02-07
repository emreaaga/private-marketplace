import { IsString, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateClientDto } from 'src/clients/dto/create-client.dto';
import { CreateOrderItem } from 'src/order-items/dto/create-order-items.dto';

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => CreateClientDto)
  sender: CreateClientDto;

  @ValidateNested()
  @Type(() => CreateClientDto)
  receiver: CreateClientDto;

  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => CreateOrderItem)
  order_items: CreateOrderItem[];

  @IsString()
  summary: string;
}
