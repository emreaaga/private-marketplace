import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DbModule } from 'src/db/db.module';
import { BranchesController } from './branches.controller';
import { BranchesRepository } from './branches.repository';
import { BranchesService } from './branches.service';

@Module({
  imports: [DbModule, CommonModule],
  controllers: [BranchesController],
  providers: [BranchesService, BranchesRepository],
  exports: [BranchesRepository],
})
export class BranchesModule {}
