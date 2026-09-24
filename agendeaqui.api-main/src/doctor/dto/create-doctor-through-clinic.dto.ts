import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsInt,
  Min,
  Max,
  ArrayMinSize,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class ScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  @IsNotEmpty()
  dayOfWeek: number;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @IsInt()
  @Min(5)
  @IsNotEmpty()
  duration: number;
}

export class CreateDoctorThroughClinicDto {
  @IsUUID()
  @IsNotEmpty()
  clinicId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  specialtyId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ScheduleDto)
  schedules: ScheduleDto[];

  @IsString()
  @IsOptional()
  cnpj?: string;

  @IsString()
  @IsOptional()
  aboutMe?: string;

  @IsEnum(['male', 'female', 'other'])
  @IsOptional()
  gender?: string;
}
