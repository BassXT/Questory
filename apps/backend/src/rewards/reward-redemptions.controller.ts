import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { ListRewardRedemptionsQueryDto } from './dto/list-reward-redemptions-query.dto';
import { RejectRewardRedemptionDto } from './dto/reject-reward-redemption.dto';
import { RewardsService } from './rewards.service';

@Controller('reward-redemptions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.PARENT)
export class RewardRedemptionsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  listRewardRedemptions(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListRewardRedemptionsQueryDto
  ) {
    return this.rewardsService.listRewardRedemptions(user, query);
  }

  @Post(':redemptionId/approve')
  approveRewardRedemption(
    @CurrentUser() user: AuthenticatedUser,
    @Param('redemptionId') redemptionId: string
  ) {
    return this.rewardsService.approveRewardRedemption(user, redemptionId);
  }

  @Post(':redemptionId/reject')
  rejectRewardRedemption(
    @CurrentUser() user: AuthenticatedUser,
    @Param('redemptionId') redemptionId: string,
    @Body() dto: RejectRewardRedemptionDto
  ) {
    return this.rewardsService.rejectRewardRedemption(user, redemptionId, dto);
  }

  @Post(':redemptionId/mark-redeemed')
  markRewardRedemptionRedeemed(
    @CurrentUser() user: AuthenticatedUser,
    @Param('redemptionId') redemptionId: string
  ) {
    return this.rewardsService.markRewardRedemptionRedeemed(user, redemptionId);
  }
}
