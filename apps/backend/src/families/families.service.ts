import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser } from '../auth/types/authenticated-user';

@Injectable()
export class FamiliesService {
  constructor(private readonly prisma: PrismaService) {}

  getCurrentFamily(user: AuthenticatedUser) {
    return this.prisma.family.findUniqueOrThrow({
      where: { id: user.familyId },
      select: {
        id: true,
        name: true,
        childLoginCode: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }
}
