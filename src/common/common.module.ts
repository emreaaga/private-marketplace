import { Module } from '@nestjs/common';
import { PasswordService, TokenService } from './services';

@Module({
  providers: [PasswordService, TokenService],
  exports: [PasswordService, TokenService],
})
export class CommonModule {}
