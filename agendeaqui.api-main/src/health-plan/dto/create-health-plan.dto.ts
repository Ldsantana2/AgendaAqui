import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateHealthPlanDto {
  @IsNotEmpty()
  @IsString()
  healthOperatorId: string;

  @IsNotEmpty()
  @IsString()
  healthPlanTypeId: string;

  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsDateString()
  validUntil: string;

  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
