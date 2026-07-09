import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
}
