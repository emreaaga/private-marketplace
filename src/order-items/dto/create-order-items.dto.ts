import { IsString, IsInt, Length, Min, IsNotEmpty } from 'class-validator';

export class CreateOrderItem {
  @IsString()
  category: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  unit_price: number;
}
