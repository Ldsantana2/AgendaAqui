import { IsOptional, IsString, IsEmail } from 'class-validator';
import { IsValidCNPJ } from 'src/decorators/validation/IsValidCNPJ.decorator';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsValidCNPJ()
  cnpj?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  aboutMe?: string;

  @IsOptional()
  @IsString()
  crm?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
