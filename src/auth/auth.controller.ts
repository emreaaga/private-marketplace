import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

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
  async login(@Body() dto: LoginDto): Promise<object> {
    const tokens = await this.authService.login(dto);

    return { message: 'Successful login.', tokens };
  }
}
