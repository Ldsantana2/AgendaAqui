import { Role } from '@prisma/client';

export class CreateRoleDto {
  name: Role;
  description?: string; 
}