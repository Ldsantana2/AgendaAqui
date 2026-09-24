import {
  IsUUID,
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
  IsEmail,
} from 'class-validator';
import { Specialty, HealthOperator } from '@prisma/client';

export class DoctorResponseDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId?: string;

  @IsString()
  crm: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  gender?: string | null;

  @IsDateString()
  birthDay?: Date | null;

  @IsString()
  aboutMe?: string | null;

  @IsOptional()
  specialties?: Specialty[];

  @IsOptional()
  @IsArray()
  healthOperators?: HealthOperator[];

  @IsOptional()
  @IsArray()
  clinicIds?: (string | null)[];

  @IsOptional()
  @IsString()
  distance?: string;

  @IsEmail()
  @IsOptional()
  email?: string | null;
}
