import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { RewardsService } from './rewards.service';

@Controller('children/:childId/shop')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardShopController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  listShopRewards(@CurrentUser() user: AuthenticatedUser, @Param('childId') childId: string) {
    return this.rewardsService.listShopRewardsForChild(user, childId);
  }
}
