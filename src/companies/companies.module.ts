import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DbModule } from 'src/db/db.module';
import { CompaniesController } from './companies.controller';
import { CompaniesRepository } from './companies.repository';
import { CompaniesService } from './companies.service';

@Module({
  imports: [DbModule, CommonModule],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompaniesRepository],
  exports: [CompaniesRepository],
})
export class CompaniesModule {}
