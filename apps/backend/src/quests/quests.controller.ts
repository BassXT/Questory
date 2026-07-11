import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '../prisma/client';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { CreateQuestDto } from './dto/create-quest.dto';
import { QuestsService } from './quests.service';

@Controller('quests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get()
  listQuests(@CurrentUser() user: AuthenticatedUser) {
    return this.questsService.listQuests(user);
  }

  @Post()
  @Roles(Role.ADMIN, Role.PARENT)
  createQuest(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateQuestDto) {
    return this.questsService.createQuest(user, dto);
  }

  @Get(':questId')
  getQuest(@CurrentUser() user: AuthenticatedUser, @Param('questId') questId: string) {
    return this.questsService.getQuest(user, questId);
  }
}
