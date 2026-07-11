import { Role } from '../../prisma/client';

export interface AuthenticatedUser {
  sub: string;
  familyId: string;
  email: string;
  role: Role;
}
