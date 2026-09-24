import { IsOptional } from 'class-validator';
import { DoctorResponseDto } from '../../doctor/dto/response-doctor.dto';
import { ClinicResponseDto } from '../../clinic/dto/response-clinic.dto';
import { PatientResponseDto } from 'src/patient/dto/response-patient.dto';

export class ResponseUserDto {
  id: string;
  email: string;
  role: string;

  @IsOptional()
  doctor?: DoctorResponseDto;

  @IsOptional()
  clinic?: ClinicResponseDto;

  @IsOptional()
  patient?: PatientResponseDto;
}
