import { Patient } from '../../patient/entities/patient.entity';
import { Doctor } from '../../doctor/entities/doctor.entity';
import { Clinic } from '../../clinic/entities/clinic.entity';
import {  Role } from '@prisma/client';

export class User {
  id: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date | null;
  lastLoginIp?: string | null;
  loginCount: number;

  // Relacionamento
  patient?: Patient;
  doctor?: Doctor;
  clinic?: Clinic;
}
