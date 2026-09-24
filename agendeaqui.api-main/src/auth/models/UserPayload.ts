import { Role } from '@prisma/client';

export interface UserPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
  role: Role;
}
