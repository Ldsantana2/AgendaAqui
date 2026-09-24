import { IsArray, IsOptional, IsString, ArrayUnique } from 'class-validator';

export class UpdateMedicationDto {
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  currentMedications?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  pastMedications?: string[];
}
