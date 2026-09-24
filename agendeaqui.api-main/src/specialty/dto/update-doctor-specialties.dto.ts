import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';

class DoctorSpecialtyInput {
  @IsString()
  id: string;

  @IsBoolean()
  isPrimary: boolean;
}

export class UpdateDoctorSpecialtiesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorSpecialtyInput)
  specialties: DoctorSpecialtyInput[];
}
