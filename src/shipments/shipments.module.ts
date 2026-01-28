import { Module } from '@nestjs/common';
import { ShipmentsController } from './shipments.controller';
import { DbModule } from 'src/db/db.module';
import { ShipmentsRepository } from './shipments.repository';
import { ShipmentsService } from './shipments.service';

@Module({
  imports: [DbModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsRepository, ShipmentsService],
})
export class ShipmentsModule {}
