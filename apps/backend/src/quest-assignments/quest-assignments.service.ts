import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestCompletionStatus, QuestType, Role } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestAssignmentDto } from './dto/create-quest-assignment.dto';

const questAssignmentSelect = {
  id: true,
  questId: true,
  childProfileId: true,
  dueAt: true,
  createdAt: true,
  updatedAt: true,
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
};

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

    if (!quest) {
      throw new NotFoundException('Quest not found.');
    }

    if (!childProfile) {
      throw new NotFoundException('Child profile not found.');
    }

    if (!quest.isActive) {
      throw new BadRequestException('Inactive quests cannot be assigned.');
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
        id: true
      }
    });

    if (!childProfile) {
      throw new NotFoundException('Child profile not found.');
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

    if (user.role === Role.CHILD && assignment.childProfile.userId !== user.sub) {
      throw new ForbiddenException('Children can only complete their own quest assignments.');
    }

    if (!assignment.quest.isActive) {
      throw new BadRequestException('Inactive quests cannot be completed.');
    }

    const blockingCompletion = await this.prisma.questCompletion.findFirst({
      where: {
        questAssignmentId: assignmentId,
        status:
          assignment.quest.type === QuestType.ONE_TIME
            ? { in: [QuestCompletionStatus.SUBMITTED, QuestCompletionStatus.APPROVED] }
            : QuestCompletionStatus.SUBMITTED
      },
      select: {
        id: true,
        status: true
      }
    });

    if (blockingCompletion) {
      throw new ConflictException('Quest assignment already has a pending or completed submission.');
    }

    return this.prisma.questCompletion.create({
      data: {
        questAssignmentId: assignmentId,
        status: QuestCompletionStatus.SUBMITTED
      },
      select: questCompletionSelect
    });
  }
}
