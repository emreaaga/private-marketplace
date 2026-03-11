import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ACCESS_COOKIE_DELETE,
  ACCESS_COOKIE_OPTIONS,
  REFRESH_COOKIE_DELETE,
  REFRESH_COOKIE_OPTIONS,
  USER_METADA_COOKIE_DELETE,
  USER_METADA_COOKIE_OPTIONS,
} from 'src/common/constants/auth.constants';
import { AccessTokenPayload } from 'src/common/types/auth.types';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import type { RefreshTokenRequest } from './dto/types';
import { AccessTokenGuard } from './guards/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, user } =
      await this.authService.login(dto);

    res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);

    res.cookie(
      'user_metadata',
      encodeURIComponent(JSON.stringify(user)),
      USER_METADA_COOKIE_OPTIONS,
    );

    return { message: 'Logged in' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): object {
    res.clearCookie('refresh_token', REFRESH_COOKIE_DELETE);
    res.clearCookie('access_token', ACCESS_COOKIE_DELETE);
    res.clearCookie('user_metadata', USER_METADA_COOKIE_DELETE);

    return { message: 'Successful logout.' };
  }

  @Post('refresh')
  async refresh(
    @Req() request: RefreshTokenRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = request.cookies.refresh_token;

    const { accessToken, user } =
      await this.authService.refreshToken(refreshToken);

    res.cookie('access_token', accessToken, ACCESS_COOKIE_OPTIONS);

    res.cookie(
      'user_metadata',
      encodeURIComponent(JSON.stringify(user)),
      USER_METADA_COOKIE_OPTIONS,
    );

    return { message: 'Token refreshed' };
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  async getMe(@Req() req: Request & { user: AccessTokenPayload }) {
    const user = await this.authService.getMe(req.user.sub);

    return {
      user,
    };
  }

  // Временно отключен, в будущем нужно будет включить
  @Post('register')
  register(@Body() dto: RegisterDto): object {
    return {
      message: 'User registered successfully.',
      data: {
        name: dto.email,
        email: dto.email,
      },
    };
  }
}
