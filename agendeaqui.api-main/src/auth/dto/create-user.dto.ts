import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { Role } from '@prisma/client';
import { IsValidCPF } from 'src/decorators/validation/IsValidCPF.decorator';
import { IsValidCNPJ } from 'src/decorators/validation/IsValidCNPJ.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  passwordConfirmation: string;

  @IsValidCPF()
  @IsOptional()
  cpf?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsDateString()
  birthDay: string;

  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @IsBoolean()
  isTermsAndConditionsAccepted: boolean;
}

export class CreateDoctorDto extends CreateUserDto {
  @IsString()
  crm: string;

  @IsString()
  specialtyId: string;

  @IsValidCNPJ()
  cnpj: string;
}
export class CreateClinicAddressDto {
  @IsString()
  street: string;
  @IsString()
  number: string;
  @IsString()
  city: string;
  @IsString()
  state: string;
  @IsString()
  zipCode: string;
  @IsString()
  @IsOptional()
  complement?: string;
  @IsOptional()
  location?: {
    latitude: string;
    longitude: string;
  };
}

export class CreateClinicDto {
  @IsString()
  name: string;
  @IsString()
  responsibleName: string;
  @IsEmail()
  email: string;
  @IsValidCNPJ()
  cnpj: string;
  @IsString()
  @MinLength(6)
  password: string;
  @IsString()
  @MinLength(6)
  passwordConfirmation: string;
  @IsString()
  @IsOptional()
  about?: string;
  @IsObject()
  address: CreateClinicAddressDto;
  @IsBoolean()
  isTermsAndConditionsAccepted: boolean;
}
