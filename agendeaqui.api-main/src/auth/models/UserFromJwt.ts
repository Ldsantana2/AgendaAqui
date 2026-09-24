import { Role } from '@prisma/client';
export interface UserFromJwt {
  id: string;
  email: string;
  role: Role;
}
