import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DbModule } from 'src/db/db.module';
import { ShipmentsController } from './shipments.controller';
import { ShipmentsRepository } from './shipments.repository';
import { ShipmentsService } from './shipments.service';

@Module({
  imports: [DbModule, CommonModule],
  controllers: [ShipmentsController],
  providers: [ShipmentsRepository, ShipmentsService],
  exports: [ShipmentsRepository],
})
export class ShipmentsModule {}
