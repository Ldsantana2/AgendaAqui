import { Role } from '@prisma/client';

export class AssignUserToClinicDto {
  userId: string;
  clinicId: string;
  role: Role;
}