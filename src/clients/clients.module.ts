import { Module } from '@nestjs/common';
import ClientsController from './clients.controller';
import { ClientsRepository } from './clients.repository';
import { ClientsService } from './clients.service';
import { DbModule } from 'src/db/db.module';
import { ClientPassportsModule } from 'src/client-passports/client-passports.module';

@Module({
  imports: [DbModule, ClientPassportsModule],
  controllers: [ClientsController],
  providers: [ClientsService, ClientsRepository],
  exports: [ClientsRepository],
})
export class ClientsModule {}
