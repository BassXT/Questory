import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user';
import { CreateChildDto } from './dto/create-child.dto';

@Injectable()
export class ChildrenService {
  constructor(private readonly prisma: PrismaService) {}

  createChildProfile(user: AuthenticatedUser, dto: CreateChildDto) {
    return this.prisma.childProfile.create({
      data: {
        familyId: user.familyId,
        displayName: dto.displayName.trim(),
        avatarKey: dto.avatarKey?.trim() || null
      }
    });
  }

  listChildren(user: AuthenticatedUser) {
    return this.prisma.childProfile.findMany({
      where: { familyId: user.familyId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        familyId: true,
        userId: true,
        displayName: true,
        avatarKey: true,
        level: true,
        xp: true,
        coins: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getChild(user: AuthenticatedUser, childId: string) {
    const child = await this.prisma.childProfile.findFirst({
      where: {
        id: childId,
        familyId: user.familyId
      },
      select: {
        id: true,
        familyId: true,
        userId: true,
        displayName: true,
        avatarKey: true,
        level: true,
        xp: true,
        coins: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!child) {
      throw new NotFoundException('Child profile not found.');
    }

    return child;
  }
}
