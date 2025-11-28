import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PasswordService } from 'src/common/services/password.service';
import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto } from './dto';
import { CreatedUser } from './dto/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(dto: RegisterDto): Promise<CreatedUser> {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (user) throw new ConflictException('This email is already registered.');

    const password_hash = await this.passwordService.hashPassword(dto.password);

    const newUser = await this.authRepository.createUser(
      dto.name,
      dto.email,
      password_hash,
    );

    return newUser;
  }

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user) throw new BadRequestException('Email or password is wrong');

    const result = await this.passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!result) throw new BadRequestException('Email or password is wrong');
  }
}
