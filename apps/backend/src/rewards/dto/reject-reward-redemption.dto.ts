import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectRewardRedemptionDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  rejectionReason?: string;
}
