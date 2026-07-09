import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QuestFrequency, QuestType } from '@prisma/client';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestDto } from './dto/create-quest.dto';

const questSelect = {
  id: true,
  familyId: true,
  title: true,
  description: true,
  type: true,
  frequency: true,
  xpReward: true,
  coinReward: true,
  requiresApproval: true,
  isActive: true,
  createdByUserId: true,
  createdAt: true,
  updatedAt: true
};

@Injectable()
export class QuestsService {
  constructor(private readonly prisma: PrismaService) {}

  createQuest(user: AuthenticatedUser, dto: CreateQuestDto) {
    const frequency = dto.frequency ?? QuestFrequency.NONE;

    if (dto.type === QuestType.ONE_TIME && frequency !== QuestFrequency.NONE) {
      throw new BadRequestException('One-time quests must use frequency NONE.');
    }

    if (dto.type === QuestType.RECURRING && frequency === QuestFrequency.NONE) {
      throw new BadRequestException('Recurring quests must use DAILY, WEEKLY or CUSTOM frequency.');
    }

    return this.prisma.quest.create({
      data: {
        familyId: user.familyId,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        type: dto.type,
        frequency,
        xpReward: dto.xpReward,
        coinReward: dto.coinReward,
        requiresApproval: dto.requiresApproval ?? true,
        isActive: dto.isActive ?? true,
        createdByUserId: user.sub
      },
      select: questSelect
    });
  }

  listQuests(user: AuthenticatedUser) {
    return this.prisma.quest.findMany({
      where: { familyId: user.familyId },
      orderBy: { createdAt: 'desc' },
      select: questSelect
    });
  }

  async getQuest(user: AuthenticatedUser, questId: string) {
    const quest = await this.prisma.quest.findFirst({
      where: {
        id: questId,
        familyId: user.familyId
      },
      select: questSelect
    });

    if (!quest) {
      throw new NotFoundException('Quest not found.');
    }

    return quest;
  }
}
