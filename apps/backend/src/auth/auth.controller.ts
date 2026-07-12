import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService, AuthResponse, PublicUser } from './auth.service';
import { CurrentUser } from './authenticated-user.decorator';
import { ChildLoginDto } from './dto/child-login.dto';
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

  @Get('child-login/:familyCode/children')
  listChildLoginProfiles(@Param('familyCode') familyCode: string) {
    return this.authService.listChildLoginProfiles(familyCode);
  }

  @Post('child-login')
  childLogin(@Body() dto: ChildLoginDto): Promise<AuthResponse> {
    return this.authService.childLogin(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: AuthenticatedUser): Promise<PublicUser> {
    return this.authService.getMe(user);
  }
}
