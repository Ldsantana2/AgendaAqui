import {
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateMedicationDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  currentMedications: string[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  pastMedications: string[];
}
