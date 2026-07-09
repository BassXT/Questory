import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { QuestAssignmentsController } from './quest-assignments.controller';
import { QuestAssignmentsService } from './quest-assignments.service';

@Module({
  imports: [AuthModule],
  controllers: [QuestAssignmentsController],
  providers: [QuestAssignmentsService]
})
export class QuestAssignmentsModule {}
