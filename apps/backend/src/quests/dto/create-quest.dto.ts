import { QuestFrequency, QuestType } from '@prisma/client';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export class CreateQuestDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsIn([QuestType.ONE_TIME, QuestType.RECURRING])
  type!: QuestType;

  @IsOptional()
  @IsIn([QuestFrequency.NONE, QuestFrequency.DAILY, QuestFrequency.WEEKLY, QuestFrequency.CUSTOM])
  frequency?: QuestFrequency;

  @IsInt()
  @Min(0)
  @Max(10000)
  xpReward!: number;

  @IsInt()
  @Min(0)
  @Max(10000)
  coinReward!: number;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
