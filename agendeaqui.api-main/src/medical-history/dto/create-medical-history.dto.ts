import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMedicalHistoryDto {
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  pastDiseases?: string;

  @IsOptional()
  @IsString()
  chronicDiseases?: string;

  @IsOptional()
  @IsString()
  familySeriousDiseases?: string;

  @IsOptional()
  @IsString()
  allergies?: string;
}
