import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'node:crypto';
import { ChildProfile, Role, User } from '../prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ChildLoginDto } from './dto/child-login.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterFamilyDto } from './dto/register-family.dto';
import { PasswordService } from './password.service';
import { AuthenticatedUser } from './types/authenticated-user';

export interface AuthResponse {
  accessToken: string;
  user: PublicUser;
}

export interface PublicUser {
  id: string;
  familyId: string;
  email: string | null;
  displayName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChildLoginProfile {
  id: string;
  displayName: string;
  avatarKey: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService
  ) {}

  async registerFamily(dto: RegisterFamilyDto): Promise<AuthResponse> {
    const email = dto.email.toLowerCase().trim();
    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const passwordHash = await this.passwordService.hashPassword(dto.password);
    const childLoginCode = await this.createUniqueChildLoginCode();
    const user = await this.prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: {
          name: dto.familyName.trim(),
          childLoginCode
        }
      });

      return tx.user.create({
        data: {
          familyId: family.id,
          email,
          passwordHash,
          displayName: dto.displayName.trim(),
          role: Role.PARENT
        }
      });
    });

    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatches = await this.passwordService.verifyPassword(dto.password, user.passwordHash);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.createAuthResponse(user);
  }

  async listChildLoginProfiles(familyCode: string): Promise<ChildLoginProfile[]> {
    const family = await this.prisma.family.findUnique({
      where: { childLoginCode: this.normalizeChildLoginCode(familyCode) },
      select: {
        children: {
          where: {
            pinEnabled: true,
            pinHash: {
              not: null
            }
          },
          orderBy: { displayName: 'asc' },
          select: {
            id: true,
            displayName: true,
            avatarKey: true
          }
        }
      }
    });

    return family?.children ?? [];
  }

  async childLogin(dto: ChildLoginDto): Promise<AuthResponse> {
    const child = await this.prisma.childProfile.findFirst({
      where: {
        id: dto.childProfileId,
        family: {
          childLoginCode: this.normalizeChildLoginCode(dto.familyCode)
        }
      }
    });

    if (!child || !child.pinEnabled || !child.pinHash) {
      throw new UnauthorizedException('Invalid child login.');
    }

    const pinMatches = await this.passwordService.verifyPassword(dto.pin, child.pinHash);

    if (!pinMatches) {
      throw new UnauthorizedException('Invalid child login.');
    }

    return this.createChildAuthResponse(child);
  }

  async getMe(currentUser: AuthenticatedUser): Promise<PublicUser> {
    if (currentUser.role === Role.CHILD && currentUser.childProfileId) {
      const child = await this.prisma.childProfile.findFirstOrThrow({
        where: {
          id: currentUser.childProfileId,
          familyId: currentUser.familyId
        }
      });

      return this.toPublicChildUser(child);
    }

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: currentUser.sub }
    });

    return this.toPublicUser(user);
  }

  private async createAuthResponse(user: User): Promise<AuthResponse> {
    const payload: AuthenticatedUser = {
      sub: user.id,
      familyId: user.familyId,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.toPublicUser(user)
    };
  }

  private async createChildAuthResponse(child: ChildProfile): Promise<AuthResponse> {
    const payload: AuthenticatedUser = {
      sub: child.id,
      familyId: child.familyId,
      email: null,
      role: Role.CHILD,
      childProfileId: child.id
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: this.toPublicChildUser(child)
    };
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

  private toPublicChildUser(child: ChildProfile): PublicUser {
    return {
      id: child.id,
      familyId: child.familyId,
      email: null,
      displayName: child.displayName,
      role: Role.CHILD,
      createdAt: child.createdAt,
      updatedAt: child.updatedAt
    };
  }

  private normalizeChildLoginCode(code: string): string {
    return code.trim().toUpperCase();
  }

  private async createUniqueChildLoginCode(): Promise<string> {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const code = this.generateChildLoginCode();
      const existingFamily = await this.prisma.family.findUnique({
        where: { childLoginCode: code },
        select: { id: true }
      });

      if (!existingFamily) {
        return code;
      }
    }

    throw new ConflictException('Could not generate a unique child login code.');
  }

  private generateChildLoginCode(): string {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const characters = Array.from({ length: 8 }, () => alphabet[randomInt(alphabet.length)]);
    return `${characters.slice(0, 4).join('')}-${characters.slice(4).join('')}`;
  }
}
