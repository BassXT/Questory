import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '../prisma/client';
import { PrismaService } from '../prisma/prisma.service';
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
  email: string;
  displayName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
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
    const user = await this.prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: {
          name: dto.familyName.trim()
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

  async getMe(currentUser: AuthenticatedUser): Promise<PublicUser> {
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
