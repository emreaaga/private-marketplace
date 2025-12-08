import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [DbModule, CommonModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
