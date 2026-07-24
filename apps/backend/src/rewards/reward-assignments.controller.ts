import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '../prisma/client';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { CreateRewardAssignmentDto } from './dto/create-reward-assignment.dto';
import { RewardsService } from './rewards.service';

@Controller('reward-assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.PARENT)
export class RewardAssignmentsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  listRewardAssignments(@CurrentUser() user: AuthenticatedUser) {
    return this.rewardsService.listRewardAssignments(user);
  }

  @Post()
  createRewardAssignment(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateRewardAssignmentDto) {
    return this.rewardsService.createRewardAssignment(user, dto);
  }
}
