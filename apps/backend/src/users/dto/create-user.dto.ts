import { Role } from '../../prisma/client';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName!: string;

  @IsEmail()
  email!: string;

  @IsIn([Role.PARENT, Role.CHILD])
  role!: Role;

  @ValidateIf((dto: CreateUserDto) => dto.role === Role.PARENT)
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  avatarKey?: string;
}
