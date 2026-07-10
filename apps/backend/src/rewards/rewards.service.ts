import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRewardDto } from './dto/create-reward.dto';

const rewardSelect = {
  id: true,
  familyId: true,
  name: true,
  description: true,
  imageUrl: true,
  category: true,
  price: true,
  isActive: true,
  requiresApproval: true,
  maxRedemptions: true,
  createdAt: true,
  updatedAt: true
};

@Injectable()
export class RewardsService {
  constructor(private readonly prisma: PrismaService) {}

  createReward(user: AuthenticatedUser, dto: CreateRewardDto) {
    return this.prisma.reward.create({
      data: {
        familyId: user.familyId,
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        imageUrl: dto.imageUrl?.trim() || null,
        category: dto.category?.trim() || null,
        price: dto.price,
        isActive: dto.isActive ?? true,
        requiresApproval: dto.requiresApproval ?? true,
        maxRedemptions: dto.maxRedemptions ?? null
      },
      select: rewardSelect
    });
  }

  listRewards(user: AuthenticatedUser) {
    return this.prisma.reward.findMany({
      where: { familyId: user.familyId },
      orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
      select: rewardSelect
    });
  }

  async getReward(user: AuthenticatedUser, rewardId: string) {
    const reward = await this.prisma.reward.findFirst({
      where: {
        id: rewardId,
        familyId: user.familyId
      },
      select: rewardSelect
    });

    if (!reward) {
      throw new NotFoundException('Reward not found.');
    }

    return reward;
  }

  async listShopRewardsForChild(user: AuthenticatedUser, childId: string) {
    const child = await this.prisma.childProfile.findFirst({
      where: {
        id: childId,
        familyId: user.familyId
      },
      select: {
        id: true,
        userId: true
      }
    });

    if (!child) {
      throw new NotFoundException('Child profile not found.');
    }

    if (user.role === Role.CHILD && child.userId !== user.sub) {
      throw new ForbiddenException('Children can only view their own reward shop.');
    }

    return this.prisma.reward.findMany({
      where: {
        familyId: user.familyId,
        isActive: true
      },
      orderBy: [{ price: 'asc' }, { name: 'asc' }],
      select: rewardSelect
    });
  }
}
