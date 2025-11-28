import { ConflictException, Injectable } from '@nestjs/common';
import { PasswordService } from 'src/common/services/password.service';
import { AuthRepository } from './auth.repository';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (user) throw new ConflictException('This email is already registered.');

    const password_hash = await this.passwordService.hashPassword(dto.password);

    await this.authRepository.createUser(dto.name, dto.email, password_hash);
  }
}
