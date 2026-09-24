import {
  IsUUID,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  isString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { isStringObject } from 'util/types';

class HealthOperatorDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}

class HealthPlanDto {
  @IsUUID()
  id: string;

  @IsString()
  number: string;

  @IsString()
  planName: string;

  @IsString()
  situation: string;

  @IsString()
  accommodation: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => HealthOperatorDto)
  healthOperator?: HealthOperatorDto;

  @IsOptional()
  isPrimary?: boolean;

  @IsOptional()
  validUntil: Date;
}

export class PatientResponseDto {
  @IsUUID()
  id: string;

  @IsUUID()
  userId: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  cpf: string;

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HealthPlanDto)
  healthPlans?: HealthPlanDto[];

  @IsOptional()
  @IsArray()
  medicalHistory?: any[];

  @IsOptional()
  @IsArray()
  medications?: any[];
}
