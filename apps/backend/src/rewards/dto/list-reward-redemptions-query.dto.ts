import { RewardRedemptionStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export class ListRewardRedemptionsQueryDto {
  @IsOptional()
  @IsUUID()
  childProfileId?: string;

  @IsOptional()
  @IsEnum(RewardRedemptionStatus)
  status?: RewardRedemptionStatus;
}
