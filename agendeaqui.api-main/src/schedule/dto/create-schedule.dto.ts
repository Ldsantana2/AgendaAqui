import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { ScheduleType } from '@prisma/client';

export class CreateScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @IsUUID()
  @IsNotEmpty()
  clinicId: string;

  @IsUUID()
  @IsNotEmpty()
  clinicLocationId: string;

  @IsUUID()
  @IsNotEmpty()
  clinicServiceId: string; // <-- Adicionado como obrigatório

  @IsEnum(ScheduleType)
  @IsNotEmpty()
  type: ScheduleType;

  @Min(0)
  @Max(6)
  @IsNotEmpty()
  dayOfWeek: number; // 0 = domingo

  @IsString()
  @IsNotEmpty()
  startTime: string; // ex: '14:00'

  @IsString()
  @IsNotEmpty()
  endTime: string; // ex: '18:00'

  @Min(1)
  @IsNotEmpty()
  duration: number; // em minutos
}
