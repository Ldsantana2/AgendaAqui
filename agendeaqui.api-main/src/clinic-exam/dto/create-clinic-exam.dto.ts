import { IsUUID } from 'class-validator';

export class CreateClinicExamDto {
  @IsUUID()
  clinicId: string;

  @IsUUID()
  examId: string;
}

