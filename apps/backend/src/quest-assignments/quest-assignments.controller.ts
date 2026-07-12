import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '../prisma/client';
import { CurrentUser } from '../auth/authenticated-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { CompleteSelfServiceQuestDto } from './dto/complete-self-service-quest.dto';
import { CreateQuestAssignmentDto } from './dto/create-quest-assignment.dto';
import { RejectQuestCompletionDto } from './dto/reject-quest-completion.dto';
import { QuestAssignmentsService } from './quest-assignments.service';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class QuestAssignmentsController {
  constructor(private readonly questAssignmentsService: QuestAssignmentsService) {}

  @Post('quest-assignments')
  @Roles(Role.ADMIN, Role.PARENT)
  createAssignment(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateQuestAssignmentDto) {
    return this.questAssignmentsService.createAssignment(user, dto);
  }

  @Get('children/:childId/quest-assignments')
  listAssignmentsForChild(@CurrentUser() user: AuthenticatedUser, @Param('childId') childId: string) {
    return this.questAssignmentsService.listAssignmentsForChild(user, childId);
  }

  @Post('quest-assignments/:assignmentId/complete')
  @Roles(Role.ADMIN, Role.PARENT, Role.CHILD)
  completeAssignment(@CurrentUser() user: AuthenticatedUser, @Param('assignmentId') assignmentId: string) {
    return this.questAssignmentsService.completeAssignment(user, assignmentId);
  }

  @Post('quests/:questId/self-service-completions')
  @Roles(Role.ADMIN, Role.PARENT, Role.CHILD)
  completeSelfServiceQuest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('questId') questId: string,
    @Body() dto: CompleteSelfServiceQuestDto
  ) {
    return this.questAssignmentsService.completeSelfServiceQuest(user, questId, dto);
  }

  @Post('quest-completions/:completionId/approve')
  @Roles(Role.ADMIN, Role.PARENT)
  approveCompletion(@CurrentUser() user: AuthenticatedUser, @Param('completionId') completionId: string) {
    return this.questAssignmentsService.approveCompletion(user, completionId);
  }

  @Post('quest-completions/:completionId/reject')
  @Roles(Role.ADMIN, Role.PARENT)
  rejectCompletion(
    @CurrentUser() user: AuthenticatedUser,
    @Param('completionId') completionId: string,
    @Body() dto: RejectQuestCompletionDto
  ) {
    return this.questAssignmentsService.rejectCompletion(user, completionId, dto);
  }
}
