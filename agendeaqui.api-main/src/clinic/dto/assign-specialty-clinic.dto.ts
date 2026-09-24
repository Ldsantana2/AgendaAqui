import { IsString } from 'class-validator';

export class AssignSpecialtyToClinicDto {
  @IsString()
  specialtyId: string;
}