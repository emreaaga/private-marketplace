import { Body, Controller, HttpCode, Post, Res, Req } from '@nestjs/common';
import type { Response } from 'express';
import {
  REFRESH_COOKIE_DELETE,
  REFRESH_COOKIE_OPTIONS,
} from 'src/common/constants/auth.constants';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import type { RefreshTokenRequest } from './dto/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterDto): Promise<object> {
    const user = await this.authService.register(dto);
    return { message: 'User registered successfully.', user };
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<object> {
    const tokens = await this.authService.login(dto);

    res.cookie('refresh_token', tokens.refreshToken, REFRESH_COOKIE_OPTIONS);

    return { message: 'Successful login.', accessToken: tokens.accessToken };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response): object {
    res.clearCookie('refresh_token', REFRESH_COOKIE_DELETE);

    return { message: 'Successful logout.' };
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Req() request: RefreshTokenRequest): Promise<object> {
    const refreshToken = request.cookies.refresh_token;
    const accessToken = await this.authService.refreshToken(refreshToken);
    return { message: 'Refresh token endpoint', accessToken };
  }
}
