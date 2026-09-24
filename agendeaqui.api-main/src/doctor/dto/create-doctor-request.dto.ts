import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
  IsUUID,
  IsEmail,
} from 'class-validator';
import { IsValidCNPJ } from 'src/decorators/validation/IsValidCNPJ.decorator';

export class CreateDoctorRequestDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsValidCNPJ()
  @IsOptional()
  cnpj?: string;

  @IsUUID()
  specialtyId: string;

  @IsString()
  @IsNotEmpty()
  crm: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsDateString()
  birthDay: Date;

  @IsEnum(['male', 'female', 'other'])
  gender: string;
}
