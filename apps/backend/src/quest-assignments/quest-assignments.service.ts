import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestCompletionStatus, Role } from '../prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteSelfServiceQuestDto } from './dto/complete-self-service-quest.dto';
import { CreateQuestAssignmentDto } from './dto/create-quest-assignment.dto';
import { RejectQuestCompletionDto } from './dto/reject-quest-completion.dto';

const questAssignmentSelect = {
  id: true,
  questId: true,
  childProfileId: true,
  dueAt: true,
  createdAt: true,
  updatedAt: true,
  completions: {
    orderBy: {
      submittedAt: 'desc'
    },
    take: 1,
    select: {
      id: true,
      status: true,
      submittedAt: true,
      approvedAt: true,
      rejectedAt: true,
      rejectionReason: true,
      xpGranted: true,
      coinsGranted: true
    }
  },
  quest: {
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      frequency: true,
      xpReward: true,
      coinReward: true,
      requiresApproval: true,
      isActive: true
    }
  }
} as const;

const questCompletionSelect = {
  id: true,
  questAssignmentId: true,
  status: true,
  submittedAt: true,
  approvedAt: true,
  approvedByUserId: true,
  rejectedAt: true,
  rejectionReason: true,
  xpGranted: true,
  coinsGranted: true,
  questAssignment: {
    select: {
      id: true,
      childProfileId: true,
      dueAt: true,
      quest: {
        select: {
          id: true,
          title: true,
          type: true,
          frequency: true,
          xpReward: true,
          coinReward: true,
          requiresApproval: true
        }
      }
    }
  }
};

const approvedQuestCompletionSelect = {
  id: true,
  questAssignmentId: true,
  status: true,
  submittedAt: true,
  approvedAt: true,
  approvedByUserId: true,
  rejectedAt: true,
  rejectionReason: true,
  xpGranted: true,
  coinsGranted: true,
  questAssignment: {
    select: {
      id: true,
      childProfileId: true,
      childProfile: {
        select: {
          id: true,
          displayName: true,
          level: true,
          xp: true,
          coins: true
        }
      },
      quest: {
        select: {
          id: true,
          title: true,
          xpReward: true,
          coinReward: true
        }
      }
    }
  }
};

const SELF_SERVICE_QUESTS_ENABLED = false;

function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

@Injectable()
export class QuestAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssignment(user: AuthenticatedUser, dto: CreateQuestAssignmentDto) {
    const [quest, childProfile] = await Promise.all([
      this.prisma.quest.findFirst({
        where: {
          id: dto.questId,
          familyId: user.familyId
        },
        select: {
          id: true,
          isActive: true,
          isAssignable: true
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

    if (!quest) {
      throw new NotFoundException('Quest not found.');
    }

    if (!childProfile) {
      throw new NotFoundException('Child profile not found.');
    }

    if (!quest.isActive) {
      throw new BadRequestException('Inactive quests cannot be assigned.');
    }

    if (!quest.isAssignable) {
      throw new BadRequestException('Quest cannot be manually assigned.');
    }

    const existingAssignment = await this.prisma.questAssignment.findFirst({
      where: {
        questId: dto.questId,
        childProfileId: dto.childProfileId
      },
      select: {
        id: true
      }
    });

    if (existingAssignment) {
      throw new ConflictException('Quest is already assigned to this child.');
    }

    return this.prisma.questAssignment.create({
      data: {
        questId: dto.questId,
        childProfileId: dto.childProfileId,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : null
      },
      select: questAssignmentSelect
    });
  }

  async listAssignmentsForChild(user: AuthenticatedUser, childProfileId: string) {
    const childProfile = await this.prisma.childProfile.findFirst({
      where: {
        id: childProfileId,
        familyId: user.familyId
      },
      select: {
        id: true,
        userId: true
      }
    });

    if (!childProfile) {
      throw new NotFoundException('Child profile not found.');
    }

    if (!this.canAccessChild(user, childProfile)) {
      throw new ForbiddenException('Children can only view their own quest assignments.');
    }

    return this.prisma.questAssignment.findMany({
      where: {
        childProfileId,
        childProfile: {
          familyId: user.familyId
        }
      },
      orderBy: [{ dueAt: 'asc' }, { createdAt: 'desc' }],
      select: questAssignmentSelect
    });
  }

  async completeAssignment(user: AuthenticatedUser, assignmentId: string) {
    const assignment = await this.prisma.questAssignment.findFirst({
      where: {
        id: assignmentId,
        childProfile: {
          familyId: user.familyId
        }
      },
      select: {
        id: true,
        childProfile: {
          select: {
            id: true,
            userId: true
          }
        },
        quest: {
          select: {
            type: true,
            isActive: true
          }
        }
      }
    });

    if (!assignment) {
      throw new NotFoundException('Quest assignment not found.');
    }

    if (!this.canAccessChild(user, assignment.childProfile)) {
      throw new ForbiddenException('Children can only complete their own quest assignments.');
    }

    if (!assignment.quest.isActive) {
      throw new BadRequestException('Inactive quests cannot be completed.');
    }

    const blockingCompletion = await this.prisma.questCompletion.findFirst({
      where: {
        questAssignmentId: assignmentId,
        status: QuestCompletionStatus.SUBMITTED
      },
      select: {
        id: true,
        status: true
      }
    });

    if (blockingCompletion) {
      throw new ConflictException('Quest assignment already has a pending submission.');
    }

    return this.prisma.questCompletion.create({
      data: {
        questAssignmentId: assignmentId,
        status: QuestCompletionStatus.SUBMITTED
      },
      select: questCompletionSelect
    });
  }

  async completeSelfServiceQuest(user: AuthenticatedUser, questId: string, dto: CompleteSelfServiceQuestDto) {
    if (!SELF_SERVICE_QUESTS_ENABLED) {
      throw new BadRequestException('Self-service quests are currently disabled.');
    }

    const [quest, child] = await Promise.all([
      this.prisma.quest.findFirst({
        where: {
          id: questId,
          familyId: user.familyId
        },
        select: {
          id: true,
          type: true,
          isActive: true,
          isSelfService: true
        }
      }),
      this.prisma.childProfile.findFirst({
        where: {
          id: dto.childProfileId,
          familyId: user.familyId
        },
        select: {
          id: true,
          userId: true
        }
      })
    ]);

    if (!quest) {
      throw new NotFoundException('Quest not found.');
    }

    if (!child) {
      throw new NotFoundException('Child profile not found.');
    }

    if (!this.canAccessChild(user, child)) {
      throw new ForbiddenException('Children can only complete their own self-service quests.');
    }

    if (!quest.isActive) {
      throw new BadRequestException('Inactive quests cannot be completed.');
    }

    if (!quest.isSelfService) {
      throw new BadRequestException('Quest is not available for self-service completion.');
    }

    return this.prisma.$transaction(async (tx) => {
      const assignment =
        (await tx.questAssignment.findFirst({
          where: {
            questId,
            childProfileId: dto.childProfileId
          },
          select: {
            id: true
          }
        })) ??
        (await tx.questAssignment.create({
          data: {
            questId,
            childProfileId: dto.childProfileId,
            dueAt: null
          },
          select: {
            id: true
          }
        }));

      const blockingCompletion = await tx.questCompletion.findFirst({
        where: {
          questAssignmentId: assignment.id,
          status: QuestCompletionStatus.SUBMITTED
        },
        select: {
          id: true
        }
      });

      if (blockingCompletion) {
        throw new ConflictException('Self-service quest already has a pending submission.');
      }

      return tx.questCompletion.create({
        data: {
          questAssignmentId: assignment.id,
          status: QuestCompletionStatus.SUBMITTED
        },
        select: questCompletionSelect
      });
    });
  }

  async approveCompletion(user: AuthenticatedUser, completionId: string) {
    const completion = await this.prisma.questCompletion.findFirst({
      where: {
        id: completionId,
        questAssignment: {
          childProfile: {
            familyId: user.familyId
          }
        }
      },
      select: {
        id: true,
        status: true,
        questAssignment: {
          select: {
            childProfileId: true,
            childProfile: {
              select: {
                id: true
              }
            },
            quest: {
              select: {
                xpReward: true,
                coinReward: true
              }
            }
          }
        }
      }
    });

    if (!completion) {
      throw new NotFoundException('Quest completion not found.');
    }

    if (completion.status !== QuestCompletionStatus.SUBMITTED) {
      throw new ConflictException('Only submitted quest completions can be approved.');
    }

    const xpGranted = completion.questAssignment.quest.xpReward;
    const coinsGranted = completion.questAssignment.quest.coinReward;

    return this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.questCompletion.updateMany({
        where: {
          id: completionId,
          status: QuestCompletionStatus.SUBMITTED
        },
        data: {
          status: QuestCompletionStatus.APPROVED,
          approvedAt: new Date(),
          approvedByUserId: user.sub,
          xpGranted,
          coinsGranted
        }
      });

      if (updateResult.count !== 1) {
        throw new ConflictException('Only submitted quest completions can be approved.');
      }

      const updatedChildProfile = await tx.childProfile.update({
        where: { id: completion.questAssignment.childProfileId },
        data: {
          xp: { increment: xpGranted },
          coins: { increment: coinsGranted }
        },
        select: {
          xp: true
        }
      });

      await tx.childProfile.update({
        where: { id: completion.questAssignment.childProfileId },
        data: {
          level: calculateLevel(updatedChildProfile.xp)
        }
      });

      return tx.questCompletion.findUniqueOrThrow({
        where: { id: completionId },
        select: approvedQuestCompletionSelect
      });
    });
  }

  async rejectCompletion(user: AuthenticatedUser, completionId: string, dto: RejectQuestCompletionDto) {
    const completion = await this.prisma.questCompletion.findFirst({
      where: {
        id: completionId,
        questAssignment: {
          childProfile: {
            familyId: user.familyId
          }
        }
      },
      select: {
        id: true,
        status: true
      }
    });

    if (!completion) {
      throw new NotFoundException('Quest completion not found.');
    }

    if (completion.status !== QuestCompletionStatus.SUBMITTED) {
      throw new ConflictException('Only submitted quest completions can be rejected.');
    }

    return this.prisma.$transaction(async (tx) => {
      const updateResult = await tx.questCompletion.updateMany({
        where: {
          id: completionId,
          status: QuestCompletionStatus.SUBMITTED
        },
        data: {
          status: QuestCompletionStatus.REJECTED,
          rejectedAt: new Date(),
          rejectionReason: dto.rejectionReason?.trim() || null,
          xpGranted: 0,
          coinsGranted: 0
        }
      });

      if (updateResult.count !== 1) {
        throw new ConflictException('Only submitted quest completions can be rejected.');
      }

      return tx.questCompletion.findUniqueOrThrow({
        where: { id: completionId },
        select: questCompletionSelect
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
}
