import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordService, TokenService } from 'src/common/services';
import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto } from './dto';
// import { LoginTokens } from './dto/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (user) throw new ConflictException('This email is already registered.');

    const password_hash = await this.passwordService.hashPassword(dto.password);

    this.authRepository.createUser(dto.name, dto.email, password_hash);
  }

  async login(dto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: number; role: string };
  }> {
    const user = await this.authRepository.findUserByEmail(dto.email);

    if (!user) throw new BadRequestException('Email or password is wrong');

    const result = await this.passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!result) throw new BadRequestException('Email or password is wrong');

    const accessPayload = { sub: user.id, role: user.role };
    const refreshPayload = { sub: user.id };

    const accessToken =
      await this.tokenService.generateAccessToken(accessPayload);

    const refreshToken =
      await this.tokenService.generateRefreshToken(refreshPayload);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        role: user.role,
      },
    };
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    user: { id: number; role: string };
  }> {
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);

      const user = await this.authRepository.findUserById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      const accessPayload = { sub: user.id, role: user.role };

      const accessToken =
        await this.tokenService.generateAccessToken(accessPayload);

      return {
        accessToken,
        user: {
          id: user.id,
          role: user.role,
        },
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
