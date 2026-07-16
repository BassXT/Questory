import { IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChildDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  avatarKey?: string;

  @IsOptional()
  @IsString()
  @IsIn(['GIRL', 'BOY', 'DIVERSE', 'UNSPECIFIED'])
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
