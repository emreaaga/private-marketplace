import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { OrderItemsRepository } from './order-items.repository';

@Module({
  imports: [DbModule],
  providers: [OrderItemsRepository],
  exports: [OrderItemsRepository],
})
export class OrderItemsModule {}
