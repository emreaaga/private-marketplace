import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PasswordService, TokenService } from 'src/common/services';
import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto } from './dto';
import { CreatedUser } from './dto/types/user.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
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

  async login(dto: LoginDto): Promise<object> {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user) throw new BadRequestException('Email or password is wrong');

    const result = await this.passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!result) throw new BadRequestException('Email or password is wrong');

    const accessPayload = { sub: user.id, email: user.email };
    const refreshPayload = { sub: user.id };

    const accessToken =
      await this.tokenService.generateAccessToken(accessPayload);

    const refreshToken =
      await this.tokenService.generateRefreshToken(refreshPayload);

    return { accessToken, refreshToken };
  }
}
