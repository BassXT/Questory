import { IsString, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';

export class ChildLoginDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  familyCode!: string;

  @IsUUID()
  childProfileId!: string;

  @IsString()
  @MinLength(4)
  @MaxLength(12)
  @Matches(/^[0-9]+$/)
  pin!: string;
}
