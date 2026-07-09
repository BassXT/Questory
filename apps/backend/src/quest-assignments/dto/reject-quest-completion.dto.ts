import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectQuestCompletionDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  rejectionReason?: string;
}
