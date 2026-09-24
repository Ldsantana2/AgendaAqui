import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class FindClinicsQueryDto {
  @IsOptional()
  @IsString()
  specialtyId?: string;

  @IsOptional()
  @IsString()
  serviceCategoryId?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  healthOperatorId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  clinicId?: string;


  @IsOptional()
  @IsString()
  doctorId?: string;


  @IsOptional()
  @IsString()
  examId?: string;
}
