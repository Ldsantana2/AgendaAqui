import { IsUUID } from 'class-validator';

export class AssignClinicOperatorDto {
  @IsUUID()
  clinicId: string;

  @IsUUID()
  healthOperatorId: string;
}
