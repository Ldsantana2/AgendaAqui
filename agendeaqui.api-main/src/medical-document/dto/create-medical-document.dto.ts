import { IsUUID, IsOptional } from 'class-validator';

export class CreateMedicalDocumentDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  @IsOptional()
  clinicId?: string;

  @IsUUID()
  typeId: string;
}
