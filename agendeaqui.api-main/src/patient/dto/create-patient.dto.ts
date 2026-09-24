import {
  IsString,
  IsUUID,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { IsValidCPF } from 'src/decorators/validation/IsValidCPF.decorator';

export class CreatePatientDto {
  @IsString()
  @IsUUID()
  userId: string;

  @IsValidCPF()
  cpf: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsDateString()
  birthDay: Date;

  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsOptional()
  @IsString()
  cep?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  complement?: string;
}
