import { IsUUID } from 'class-validator';

export class CompleteSelfServiceQuestDto {
  @IsUUID()
  childProfileId!: string;
}
