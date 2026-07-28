import { IsDateString, IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateChildDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName?: string;

  @IsOptional()
  @IsString()
  @IsIn(['GIRL', 'BOY', 'DIVERSE', 'UNSPECIFIED'])
  gender?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string | null;
}
