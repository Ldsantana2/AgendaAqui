import { IsOptional } from 'class-validator';
import { Specialty } from '@prisma/client';

export class ClinicDoctorResponseDto {
  id: string;
  name: string;
  surname: string;
  verified: boolean;
  @IsOptional()
  specialties?: Specialty[];
}
