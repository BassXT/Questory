import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RewardRedemptionStatus, Role } from '../prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRewardAssignmentDto } from './dto/create-reward-assignment.dto';
import { CreateRewardDto } from './dto/create-reward.dto';
import { ListRewardRedemptionsQueryDto } from './dto/list-reward-redemptions-query.dto';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { RejectRewardRedemptionDto } from './dto/reject-reward-redemption.dto';

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
  cancelledAt: true,
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

const rewardAssignmentSelect = {
  id: true,
  rewardId: true,
  childProfileId: true,
  createdAt: true,
  updatedAt: true,
  reward: {
    select: rewardSelect
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
        requiresApproval: true,
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

    if (!this.canAccessChild(user, child)) {
      throw new ForbiddenException('Children can only view their own reward shop.');
    }

    return this.prisma.reward.findMany({
      where: {
        familyId: user.familyId,
        isActive: true,
        assignments: {
          some: {
            childProfileId: childId
          }
        }
      },
      orderBy: [{ price: 'asc' }, { name: 'asc' }],
      select: rewardSelect
    });
  }

  async createRewardAssignment(user: AuthenticatedUser, dto: CreateRewardAssignmentDto) {
    const [reward, child] = await Promise.all([
      this.prisma.reward.findFirst({
        where: {
          id: dto.rewardId,
          familyId: user.familyId
        },
        select: {
          id: true,
          isActive: true
        }
      }),
      this.prisma.childProfile.findFirst({
        where: {
          id: dto.childProfileId,
          familyId: user.familyId
        },
        select: {
          id: true
        }
      })
    ]);

    if (!reward) {
      throw new NotFoundException('Reward not found.');
    }

    if (!child) {
      throw new NotFoundException('Child profile not found.');
    }

    if (!reward.isActive) {
      throw new BadRequestException('Inactive rewards cannot be assigned.');
    }

    try {
      return await this.prisma.rewardAssignment.create({
        data: {
          rewardId: dto.rewardId,
          childProfileId: dto.childProfileId
        },
        select: rewardAssignmentSelect
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Reward is already assigned to this child.');
      }

      throw error;
    }
  }

  listRewardAssignments(user: AuthenticatedUser) {
    return this.prisma.rewardAssignment.findMany({
      where: {
        childProfile: {
          familyId: user.familyId
        }
      },
      orderBy: [{ createdAt: 'desc' }],
      select: rewardAssignmentSelect
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

    if (!this.canAccessChild(user, child)) {
      throw new ForbiddenException('Children can only redeem rewards for themselves.');
    }

    if (!reward.isActive) {
      throw new BadRequestException('Inactive rewards cannot be redeemed.');
    }

    const rewardAssignment = await this.prisma.rewardAssignment.findUnique({
      where: {
        rewardId_childProfileId: {
          rewardId,
          childProfileId: dto.childProfileId
        }
      },
      select: {
        id: true
      }
    });

    if (!rewardAssignment) {
      throw new BadRequestException('Reward is not assigned to this child.');
    }

    return this.prisma.$transaction(async (tx) => {
      if (reward.maxRedemptions !== null) {
        const existingRedemptions = await tx.rewardRedemption.count({
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
          status: RewardRedemptionStatus.REQUESTED,
          approvedAt: null,
          approvedByUserId: null,
          coinCost: reward.price
        },
        select: rewardRedemptionSelect
      });
    });
  }

  listRewardRedemptions(user: AuthenticatedUser, query: ListRewardRedemptionsQueryDto) {
    return this.prisma.rewardRedemption.findMany({
      where: {
        status: query.status,
        childProfileId: query.childProfileId,
        childProfile: {
          familyId: user.familyId
        }
      },
      orderBy: [{ requestedAt: 'desc' }],
      select: rewardRedemptionSelect
    });
  }

  async approveRewardRedemption(user: AuthenticatedUser, redemptionId: string) {
    const redemption = await this.prisma.rewardRedemption.findFirst({
      where: {
        id: redemptionId,
        childProfile: {
          familyId: user.familyId
        }
      },
      select: {
        id: true,
        status: true
      }
    });

    if (!redemption) {
      throw new NotFoundException('Reward redemption not found.');
    }

    if (redemption.status !== RewardRedemptionStatus.REQUESTED) {
      throw new ConflictException('Only requested reward redemptions can be approved.');
    }

    return this.prisma.$transaction(async (tx) => {
      const redemptionUpdate = await tx.rewardRedemption.updateMany({
        where: {
          id: redemptionId,
          status: RewardRedemptionStatus.REQUESTED
        },
        data: {
          status: RewardRedemptionStatus.APPROVED,
          approvedAt: new Date(),
          approvedByUserId: user.sub
        }
      });

      if (redemptionUpdate.count !== 1) {
        throw new ConflictException('Only requested reward redemptions can be approved.');
      }

      return tx.rewardRedemption.findUniqueOrThrow({
        where: { id: redemptionId },
        select: rewardRedemptionSelect
      });
    });
  }

  async rejectRewardRedemption(
    user: AuthenticatedUser,
    redemptionId: string,
    dto: RejectRewardRedemptionDto
  ) {
    const redemption = await this.prisma.rewardRedemption.findFirst({
      where: {
        id: redemptionId,
        childProfile: {
          familyId: user.familyId
        }
      },
      select: {
        id: true,
        status: true,
        childProfileId: true,
        coinCost: true
      }
    });

    if (!redemption) {
      throw new NotFoundException('Reward redemption not found.');
    }

    if (redemption.status !== RewardRedemptionStatus.REQUESTED) {
      throw new ConflictException('Only requested reward redemptions can be rejected.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.rewardRedemption.updateMany({
        where: {
          id: redemptionId,
          status: RewardRedemptionStatus.REQUESTED
        },
        data: {
          status: RewardRedemptionStatus.REJECTED,
          rejectedAt: new Date(),
          rejectionReason: dto.rejectionReason?.trim() || null
        }
      });

      if (updateResult.count !== 1) {
        throw new ConflictException('Only requested reward redemptions can be rejected.');
      }

      await tx.childProfile.update({
        where: {
          id: redemption.childProfileId
        },
        data: {
          coins: { increment: redemption.coinCost }
        }
      });

      return tx.rewardRedemption.findUniqueOrThrow({
        where: { id: redemptionId },
        select: rewardRedemptionSelect
      });
    });
  }

  async cancelRewardRedemption(user: AuthenticatedUser, redemptionId: string) {
    const redemption = await this.prisma.rewardRedemption.findFirst({
      where: {
        id: redemptionId,
        childProfile: {
          familyId: user.familyId
        }
      },
      select: {
        id: true,
        status: true,
        childProfileId: true,
        coinCost: true
      }
    });

    if (!redemption) {
      throw new NotFoundException('Reward redemption not found.');
    }

    if (
      redemption.status !== RewardRedemptionStatus.REQUESTED &&
      redemption.status !== RewardRedemptionStatus.APPROVED
    ) {
      throw new ConflictException('Only requested or approved reward redemptions can be cancelled.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.rewardRedemption.updateMany({
        where: {
          id: redemptionId,
          status: {
            in: [RewardRedemptionStatus.REQUESTED, RewardRedemptionStatus.APPROVED]
          }
        },
        data: {
          status: RewardRedemptionStatus.CANCELLED,
          cancelledAt: new Date()
        }
      });

      if (updateResult.count !== 1) {
        throw new ConflictException('Only requested or approved reward redemptions can be cancelled.');
      }

      await tx.childProfile.update({
        where: {
          id: redemption.childProfileId
        },
        data: {
          coins: { increment: redemption.coinCost }
        }
      });

      return tx.rewardRedemption.findUniqueOrThrow({
        where: { id: redemptionId },
        select: rewardRedemptionSelect
      });
    });
  }

  async markRewardRedemptionRedeemed(user: AuthenticatedUser, redemptionId: string) {
    const redemption = await this.prisma.rewardRedemption.findFirst({
      where: {
        id: redemptionId,
        childProfile: {
          familyId: user.familyId
        }
      },
      select: {
        id: true,
        status: true
      }
    });

    if (!redemption) {
      throw new NotFoundException('Reward redemption not found.');
    }

    if (redemption.status !== RewardRedemptionStatus.APPROVED) {
      throw new ConflictException('Only approved reward redemptions can be marked as redeemed.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.rewardRedemption.updateMany({
        where: {
          id: redemptionId,
          status: RewardRedemptionStatus.APPROVED
        },
        data: {
          status: RewardRedemptionStatus.REDEEMED,
          redeemedAt: new Date()
        }
      });

      if (updateResult.count !== 1) {
        throw new ConflictException('Only approved reward redemptions can be marked as redeemed.');
      }

      return tx.rewardRedemption.findUniqueOrThrow({
        where: { id: redemptionId },
        select: rewardRedemptionSelect
      });
    });
  }

  private canAccessChild(
    user: AuthenticatedUser,
    child: { id: string; userId: string | null }
  ): boolean {
    if (user.role !== Role.CHILD) {
      return true;
    }

    if (user.childProfileId) {
      return child.id === user.childProfileId;
    }

    return child.userId === user.sub;
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002';
  }
}
