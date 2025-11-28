import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtAccessToken, JwtRefreshToken } from 'src/auth/dto/types';

@Injectable()
export class TokenService {
  private readonly accessSecret: string;
  private readonly accessExpiresIn: number;
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessSecret =
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');

    this.accessExpiresIn = this.configService.getOrThrow<number>(
      'JWT_ACCESS_EXPIRES_IN',
    );

    this.refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    this.refreshExpiresIn = this.configService.getOrThrow<number>(
      'JWT_REFRESH_EXPIRES_IN',
    );
  }

  async generateAccessToken(payload: JwtAccessToken): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.accessSecret,
      expiresIn: `${this.accessExpiresIn}m`,
    });

    return accessToken;
  }

  async generateRefreshToken(payload: JwtRefreshToken): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: `${this.refreshExpiresIn}d`,
    });

    return refreshToken;
  }
}
