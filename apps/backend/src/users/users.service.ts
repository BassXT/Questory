import { ConflictException, Injectable } from '@nestjs/common';
import { Role, User } from '../prisma/client';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { PasswordService } from '../auth/password.service';
import { CreateUserDto } from './dto/create-user.dto';

export interface PublicUser {
  id: string;
  familyId: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async createFamilyUser(currentUser: AuthenticatedUser, dto: CreateUserDto): Promise<PublicUser> {
    const email = dto.email.toLowerCase().trim();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const passwordHash =
      dto.role === Role.PARENT
        ? await this.passwordService.hashPassword(dto.password!)
        : await this.passwordService.hashPassword(randomUUID());

    const user = await this.prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          familyId: currentUser.familyId,
          email,
          passwordHash,
          displayName: dto.displayName.trim(),
          role: dto.role
        }
      });

      if (dto.role === Role.CHILD) {
        await tx.childProfile.create({
          data: {
            familyId: currentUser.familyId,
            userId: createdUser.id,
            displayName: dto.displayName.trim(),
            avatarKey: dto.avatarKey?.trim() || null
          }
        });
      }

      return createdUser;
    });

    return this.toPublicUser(user);
  }

  async listFamilyUsers(user: AuthenticatedUser): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany({
      where: { familyId: user.familyId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        familyId: true,
        email: true,
        displayName: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return users;
  }

  private toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      familyId: user.familyId,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
