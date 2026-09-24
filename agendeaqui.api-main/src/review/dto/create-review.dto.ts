import { IsString, IsInt, IsOptional, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsUUID()
  patient_id: string;

  @IsUUID()
  clinic_id: string;

  @IsUUID()
  appointmentId: string;
}
