import {
  IsUUID,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @IsUUID()
  @IsNotEmpty()
  scheduleId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string; // yyyy-mm-dd

  @IsString()
  @IsNotEmpty()
  startTime: string; // ex: '14:00'

  @IsString()
  @IsNotEmpty()
  endTime: string; // ex: '14:30'

  @IsUUID()
  @IsNotEmpty()
  clinicLocationId: string;

  @IsUUID()
  @IsNotEmpty()
  clinicServiceId: string;

  @IsUUID()
  @IsOptional()
  healthPlanId?: string;

  @IsUUID()
  @IsNotEmpty()
  clinicId: string;

  @IsBoolean()
  @IsOptional()
  dataConsentSharing?: boolean;
}
