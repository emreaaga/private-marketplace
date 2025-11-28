import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DbModule } from 'src/db/db.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

@Module({
  imports: [DbModule, CommonModule],
  controllers: [AuthController],
  providers: [AuthRepository, AuthService],
})
export class AuthModule {}
