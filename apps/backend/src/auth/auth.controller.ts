import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService, AuthResponse, PublicUser } from './auth.service';
import { CurrentUser } from './authenticated-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterFamilyDto } from './dto/register-family.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthenticatedUser } from './types/authenticated-user';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerFamily(@Body() dto: RegisterFamilyDto): Promise<AuthResponse> {
    return this.authService.registerFamily(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: AuthenticatedUser): Promise<PublicUser> {
    return this.authService.getMe(user);
  }
}
