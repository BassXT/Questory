import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { FamiliesService } from './families.service';

@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Get('current')
  getCurrentFamily(@CurrentUser() user: AuthenticatedUser) {
    return this.familiesService.getCurrentFamily(user);
  }
}
