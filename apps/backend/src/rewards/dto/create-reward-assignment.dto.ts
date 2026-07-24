import { IsUUID } from 'class-validator';

export class CreateRewardAssignmentDto {
  @IsUUID()
  rewardId!: string;

  @IsUUID()
  childProfileId!: string;
}
