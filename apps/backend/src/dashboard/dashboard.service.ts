import { Injectable } from '@nestjs/common';
import { QuestCompletionStatus, RewardRedemptionStatus, Role } from '../prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';

const dashboardChildSelect = {
  id: true,
  displayName: true,
  avatarKey: true,
  level: true,
  xp: true,
  coins: true
};

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(user: AuthenticatedUser) {
    const childWhere =
      user.role === Role.CHILD
        ? {
            familyId: user.familyId,
            userId: user.sub
          }
        : {
            familyId: user.familyId
          };

    const children = await this.prisma.childProfile.findMany({
      where: childWhere,
      orderBy: [{ createdAt: 'asc' }],
      select: dashboardChildSelect
    });
    const childIds = children.map((child) => child.id);

    const [
      family,
      parentCount,
      childUserCount,
      activeQuestCount,
      assignedQuestCount,
      submittedQuestCount,
      approvedQuestCount,
      rejectedQuestCount,
      approvedQuestRewards,
      activeRewardCount,
      requestedRewardCount,
      approvedRewardCount,
      redeemedRewardCount,
      rejectedRewardCount,
      spentRewardCoins
    ] = await Promise.all([
      this.prisma.family.findUniqueOrThrow({
        where: { id: user.familyId },
        select: {
          id: true,
          name: true
        }
      }),
      this.prisma.user.count({
        where: {
          familyId: user.familyId,
          role: {
            in: [Role.ADMIN, Role.PARENT]
          }
        }
      }),
      this.prisma.user.count({
        where: {
          familyId: user.familyId,
          role: Role.CHILD
        }
      }),
      this.prisma.quest.count({
        where: {
          familyId: user.familyId,
          isActive: true
        }
      }),
      this.prisma.questAssignment.count({
        where: this.childScopedQuestAssignmentWhere(user.familyId, childIds)
      }),
      this.countQuestCompletions(user.familyId, childIds, QuestCompletionStatus.SUBMITTED),
      this.countQuestCompletions(user.familyId, childIds, QuestCompletionStatus.APPROVED),
      this.countQuestCompletions(user.familyId, childIds, QuestCompletionStatus.REJECTED),
      this.prisma.questCompletion.aggregate({
        where: {
          status: QuestCompletionStatus.APPROVED,
          questAssignment: {
            childProfile: {
              familyId: user.familyId,
              id: {
                in: childIds
              }
            }
          }
        },
        _sum: {
          xpGranted: true,
          coinsGranted: true
        }
      }),
      this.prisma.reward.count({
        where: {
          familyId: user.familyId,
          isActive: true
        }
      }),
      this.countRewardRedemptions(user.familyId, childIds, RewardRedemptionStatus.REQUESTED),
      this.countRewardRedemptions(user.familyId, childIds, RewardRedemptionStatus.APPROVED),
      this.countRewardRedemptions(user.familyId, childIds, RewardRedemptionStatus.REDEEMED),
      this.countRewardRedemptions(user.familyId, childIds, RewardRedemptionStatus.REJECTED),
      this.prisma.rewardRedemption.aggregate({
        where: {
          status: {
            in: [RewardRedemptionStatus.APPROVED, RewardRedemptionStatus.REDEEMED]
          },
          childProfile: {
            familyId: user.familyId,
            id: {
              in: childIds
            }
          }
        },
        _sum: {
          coinCost: true
        }
      })
    ]);

    return {
      family,
      scope: user.role === Role.CHILD ? 'CHILD' : 'FAMILY',
      children,
      totals: {
        children: children.length,
        parents: parentCount,
        childUsers: childUserCount,
        activeQuests: activeQuestCount,
        activeRewards: activeRewardCount,
        xp: children.reduce((sum, child) => sum + child.xp, 0),
        coins: children.reduce((sum, child) => sum + child.coins, 0)
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
        totalRedemptions: requestedRewardCount + approvedRewardCount + redeemedRewardCount + rejectedRewardCount,
        coinsSpent: spentRewardCoins._sum.coinCost ?? 0
      }
    };
  }

  private childScopedQuestAssignmentWhere(familyId: string, childIds: string[]) {
    return {
      childProfile: {
        familyId,
        id: {
          in: childIds
        }
      }
    };
  }

  private countQuestCompletions(
    familyId: string,
    childIds: string[],
    status: QuestCompletionStatus
  ) {
    return this.prisma.questCompletion.count({
      where: {
        status,
        questAssignment: this.childScopedQuestAssignmentWhere(familyId, childIds)
      }
    });
  }

  private countRewardRedemptions(
    familyId: string,
    childIds: string[],
    status: RewardRedemptionStatus
  ) {
    return this.prisma.rewardRedemption.count({
      where: {
        status,
        childProfile: {
          familyId,
          id: {
            in: childIds
          }
        }
      }
    });
  }
}
