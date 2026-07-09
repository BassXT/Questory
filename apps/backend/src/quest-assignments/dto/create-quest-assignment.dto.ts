import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateQuestAssignmentDto {
  @IsUUID()
  questId!: string;

  @IsUUID()
  childProfileId!: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
