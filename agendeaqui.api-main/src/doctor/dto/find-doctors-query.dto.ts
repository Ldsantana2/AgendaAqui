import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';

export class FindDoctorsQueryDto {
  @IsOptional()
  @IsString()
  specialtyId?: string;

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
}
