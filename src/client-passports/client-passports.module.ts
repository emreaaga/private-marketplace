import { Module } from '@nestjs/common';
import { ClientPassportsRepository } from './client-passports.repository';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [DbModule],
  providers: [ClientPassportsRepository],
  exports: [ClientPassportsRepository],
})
export class ClientPassportsModule {}
