import { IsString, IsUUID } from 'class-validator';

export class CreateClinicSpecialtyDto {
  @IsUUID()
  clinicId: string;

  @IsUUID()
  specialtyId: string;
}
