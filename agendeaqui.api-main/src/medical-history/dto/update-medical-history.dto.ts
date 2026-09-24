import { IsString, IsOptional } from 'class-validator';

export class UpdateMedicalHistoryDto {
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
