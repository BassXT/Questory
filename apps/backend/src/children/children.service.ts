import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestCompletionStatus, RewardRedemptionStatus, Role } from '../prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { CreateChildDto } from './dto/create-child.dto';

const childSelect = {
  id: true,
  familyId: true,
  userId: true,
  displayName: true,
  avatarKey: true,
  pinEnabled: true,
  pinUpdatedAt: true,
  level: true,
  xp: true,
  coins: true,
  createdAt: true,
  updatedAt: true
};

function calculateNextLevelXp(currentLevel: number): number {
  return currentLevel * currentLevel * 100;
}

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  createChildProfile(user: AuthenticatedUser, dto: CreateChildDto) {
    return this.prisma.childProfile.create({
      data: {
        familyId: user.familyId,
        displayName: dto.displayName.trim(),
        avatarKey: dto.avatarKey?.trim() || null
      },
      select: childSelect
    });
  }

  listChildren(user: AuthenticatedUser) {
    return this.prisma.childProfile.findMany({
      where: { familyId: user.familyId },
      orderBy: { createdAt: 'asc' },
      select: childSelect
    });
  }

  async getChild(user: AuthenticatedUser, childId: string) {
    const child = await this.prisma.childProfile.findFirst({
      where: {
        id: childId,
        familyId: user.familyId
      },
      select: childSelect
    });

    if (!child) {
      throw new NotFoundException('Child profile not found.');
    }

    return child;
  }

  async getChildStats(user: AuthenticatedUser, childId: string) {
    const child = await this.prisma.childProfile.findFirst({
      where: {
        id: childId,
        familyId: user.familyId
      },
      select: childSelect
    });

    if (!child) {
      throw new NotFoundException('Child profile not found.');
    }

    if (user.role === Role.CHILD && child.userId !== user.sub) {
      throw new ForbiddenException('Children can only view their own stats.');
    }

    const [
      assignedQuestCount,
      submittedQuestCount,
      approvedQuestCount,
      rejectedQuestCount,
      approvedQuestRewards,
      requestedRewardCount,
      approvedRewardCount,
      redeemedRewardCount,
      rejectedRewardCount,
      cancelledRewardCount,
      spentRewardCoins
    ] = await Promise.all([
      this.prisma.questAssignment.count({
        where: {
          childProfileId: childId,
          childProfile: {
            familyId: user.familyId
          }
        }
      }),
      this.countQuestCompletions(user.familyId, childId, QuestCompletionStatus.SUBMITTED),
      this.countQuestCompletions(user.familyId, childId, QuestCompletionStatus.APPROVED),
      this.countQuestCompletions(user.familyId, childId, QuestCompletionStatus.REJECTED),
      this.prisma.questCompletion.aggregate({
        where: {
          status: QuestCompletionStatus.APPROVED,
          questAssignment: {
            childProfileId: childId,
            childProfile: {
              familyId: user.familyId
            }
          }
        },
        _sum: {
          xpGranted: true,
          coinsGranted: true
        }
      }),
      this.countRewardRedemptions(user.familyId, childId, RewardRedemptionStatus.REQUESTED),
      this.countRewardRedemptions(user.familyId, childId, RewardRedemptionStatus.APPROVED),
      this.countRewardRedemptions(user.familyId, childId, RewardRedemptionStatus.REDEEMED),
      this.countRewardRedemptions(user.familyId, childId, RewardRedemptionStatus.REJECTED),
      this.countRewardRedemptions(user.familyId, childId, RewardRedemptionStatus.CANCELLED),
      this.prisma.rewardRedemption.aggregate({
        where: {
          status: {
            in: [
              RewardRedemptionStatus.REQUESTED,
              RewardRedemptionStatus.APPROVED,
              RewardRedemptionStatus.REDEEMED
            ]
          },
          childProfileId: childId,
          childProfile: {
            familyId: user.familyId
          }
        },
        _sum: {
          coinCost: true
        }
      })
    ]);

    const nextLevelXp = calculateNextLevelXp(child.level);

    return {
      child,
      progression: {
        level: child.level,
        xp: child.xp,
        coins: child.coins,
        nextLevelXp,
        xpToNextLevel: Math.max(nextLevelXp - child.xp, 0)
      },
      quests: {
        assigned: assignedQuestCount,
        submitted: submittedQuestCount,
        approved: approvedQuestCount,
        rejected: rejectedQuestCount,
        totalCompletions: submittedQuestCount + approvedQuestCount + rejectedQuestCount,
        xpGranted: approvedQuestRewards._sum.xpGranted ?? 0,
        coinsGranted: approvedQuestRewards._sum.coinsGranted ?? 0
      },
      rewards: {
        requested: requestedRewardCount,
        approved: approvedRewardCount,
        redeemed: redeemedRewardCount,
        rejected: rejectedRewardCount,
        cancelled: cancelledRewardCount,
        totalRedemptions:
          requestedRewardCount +
          approvedRewardCount +
          redeemedRewardCount +
          rejectedRewardCount +
          cancelledRewardCount,
        coinsSpent: spentRewardCoins._sum.coinCost ?? 0
      }
    };
  }

  private countQuestCompletions(
    familyId: string,
    childProfileId: string,
    status: QuestCompletionStatus
  ) {
    return this.prisma.questCompletion.count({
      where: {
        status,
        questAssignment: {
          childProfileId,
          childProfile: {
            familyId
          }
        }
      }
    });
  }

  private countRewardRedemptions(
    familyId: string,
    childProfileId: string,
    status: RewardRedemptionStatus
  ) {
    return this.prisma.rewardRedemption.count({
      where: {
        status,
        childProfileId,
        childProfile: {
          familyId
        }
      }
    });
  }
}
