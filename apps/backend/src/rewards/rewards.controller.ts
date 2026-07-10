import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { RewardsService } from './rewards.service';

@Controller('rewards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  listRewards(@CurrentUser() user: AuthenticatedUser) {
    return this.rewardsService.listRewards(user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PARENT)
  createReward(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateRewardDto) {
    return this.rewardsService.createReward(user, dto);
  }

  @Get(':rewardId')
  getReward(@CurrentUser() user: AuthenticatedUser, @Param('rewardId') rewardId: string) {
    return this.rewardsService.getReward(user, rewardId);
  }

  @Post(':rewardId/redeem')
  @Roles(Role.ADMIN, Role.PARENT, Role.CHILD)
  redeemReward(
    @CurrentUser() user: AuthenticatedUser,
    @Param('rewardId') rewardId: string,
    @Body() dto: RedeemRewardDto
  ) {
    return this.rewardsService.redeemReward(user, rewardId, dto);
  }
}
