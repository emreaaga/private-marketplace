import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordService, TokenService } from 'src/common/services';
import { UsersRepository } from 'src/users/users.repository';
import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto } from './dto';
// import { LoginTokens } from './dto/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly usersRep: UsersRepository,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersRep.findUserByEmail(dto.email);

    if (user) throw new ConflictException('This email is already registered.');

    const password_hash = await this.passwordService.hashPassword(dto.password);

    this.authRepository.createUser(dto.name, dto.email, password_hash);
  }

  async login(dto: LoginDto) {
    const rawUser = await this.usersRep.findUserByEmail(dto.email);

    if (!rawUser) throw new BadRequestException('Email or password is wrong');

    const { password, ...user } = rawUser;

    const result = await this.passwordService.comparePassword(
      dto.password,
      password,
    );

    if (!result) throw new BadRequestException('Email or password is wrong');

    const accessPayload = {
      sub: user.id,
      role: user.role,
      cid: user.company_id,
    };
    const refreshPayload = { sub: user.id };

    const accessToken =
      await this.tokenService.generateAccessToken(accessPayload);

    const refreshToken =
      await this.tokenService.generateRefreshToken(refreshPayload);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    user: { id: number; role: string };
  }> {
    try {
      const payload = await this.tokenService.verifyRefreshToken(refreshToken);

      const user = await this.usersRep.findUserById(payload.sub);

      if (!user) throw new UnauthorizedException('User not found');

      const accessPayload = {
        sub: user.id,
        role: user.role,
        cid: user.company_id,
      };

      const accessToken =
        await this.tokenService.generateAccessToken(accessPayload);

      return { accessToken, user };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getMe(userId: number) {
    const user = await this.usersRep.findUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }
}
