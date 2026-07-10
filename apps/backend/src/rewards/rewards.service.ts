import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RewardRedemptionStatus, Role } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { RedeemRewardDto } from './dto/redeem-reward.dto';

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

const rewardRedemptionSelect = {
  id: true,
  rewardId: true,
  childProfileId: true,
  status: true,
  requestedAt: true,
  approvedAt: true,
  approvedByUserId: true,
  redeemedAt: true,
  rejectedAt: true,
  rejectionReason: true,
  coinCost: true,
  reward: {
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      category: true,
      price: true,
      requiresApproval: true
    }
  },
  childProfile: {
    select: {
      id: true,
      displayName: true,
      coins: true
    }
  }
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

  async redeemReward(user: AuthenticatedUser, rewardId: string, dto: RedeemRewardDto) {
    const [reward, child] = await Promise.all([
      this.prisma.reward.findFirst({
        where: {
          id: rewardId,
          familyId: user.familyId
        },
        select: {
          id: true,
          isActive: true,
          price: true,
          requiresApproval: true,
          maxRedemptions: true
        }
      }),
      this.prisma.childProfile.findFirst({
        where: {
          id: dto.childProfileId,
          familyId: user.familyId
        },
        select: {
          id: true,
          userId: true,
          coins: true
        }
      })
    ]);

    if (!reward) {
      throw new NotFoundException('Reward not found.');
    }

    if (!child) {
      throw new NotFoundException('Child profile not found.');
    }

    if (user.role === Role.CHILD && child.userId !== user.sub) {
      throw new ForbiddenException('Children can only redeem rewards for themselves.');
    }

    if (!reward.isActive) {
      throw new BadRequestException('Inactive rewards cannot be redeemed.');
    }

    if (child.coins < reward.price) {
      throw new BadRequestException('Child does not have enough coins for this reward.');
    }

    if (reward.maxRedemptions !== null) {
      const existingRedemptions = await this.prisma.rewardRedemption.count({
        where: {
          rewardId,
          childProfileId: dto.childProfileId,
          status: {
            in: [
              RewardRedemptionStatus.REQUESTED,
              RewardRedemptionStatus.APPROVED,
              RewardRedemptionStatus.REDEEMED
            ]
          }
        }
      });

      if (existingRedemptions >= reward.maxRedemptions) {
        throw new ConflictException('Reward redemption limit reached for this child.');
      }
    }

    if (reward.requiresApproval) {
      return this.prisma.rewardRedemption.create({
        data: {
          rewardId,
          childProfileId: dto.childProfileId,
          status: RewardRedemptionStatus.REQUESTED,
          coinCost: reward.price
        },
        select: rewardRedemptionSelect
      });
    }

    return this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.childProfile.updateMany({
        where: {
          id: dto.childProfileId,
          coins: { gte: reward.price }
        },
        data: {
          coins: { decrement: reward.price }
        }
      });

      if (updateResult.count !== 1) {
        throw new BadRequestException('Child does not have enough coins for this reward.');
      }

      return tx.rewardRedemption.create({
        data: {
          rewardId,
          childProfileId: dto.childProfileId,
          status: RewardRedemptionStatus.APPROVED,
          approvedAt: new Date(),
          approvedByUserId: user.role === Role.CHILD ? null : user.sub,
          coinCost: reward.price
        },
        select: rewardRedemptionSelect
      });
    });
  }
}
