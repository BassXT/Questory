import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  listFamilyUsers(user: AuthenticatedUser) {
    return this.prisma.user.findMany({
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
  }
}
