import { IsUUID } from "class-validator";

export class AssignSpecialtyDto {
  @IsUUID()
  doctorId: string;

  @IsUUID()
  specialtyId: string;
}
