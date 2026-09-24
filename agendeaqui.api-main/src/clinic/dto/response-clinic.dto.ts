import { IsOptional, IsString } from 'class-validator';
import { ClinicLocationResponseDto } from './response-clinic-location.dto';
import { ClinicServiceResponseDto } from './response-clinic-service.dto';
import { ClinicDoctorResponseDto } from './response-clinic-doctor.dto';
import { ClinicReviewResponseDto } from './response-clinic-review.dto';
import { CreateSpecialtyDto } from '../../specialty/dto/create-specialty.dto';

export class ClinicResponseDto {
  id: string;
  name: string;
  cnpj: string;
  about?: string;

  locations: ClinicLocationResponseDto[];

  @IsOptional()
  services: ClinicServiceResponseDto[];

  doctors: ClinicDoctorResponseDto[];

  reviews: ClinicReviewResponseDto[];

  @IsOptional()
  specialties?: CreateSpecialtyDto[];

  @IsOptional()
  @IsString()
  distance?: string;
}
