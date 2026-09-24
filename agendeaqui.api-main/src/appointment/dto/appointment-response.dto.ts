import { ApiProperty } from '@nestjs/swagger';
import { ConfirmationStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class AppointmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  patientId: string;

  @ApiProperty()
  scheduleId: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ enum: ConfirmationStatus })
  confirmationStatus: ConfirmationStatus;

  @ApiProperty()
  clinicLocationId: string;

  @ApiProperty()
  clinicServiceId: string;

  @ApiProperty({ required: false })
  healthPlanId?: string;

  @ApiProperty()
  clinicId: string;

  // Detalhes relacionados (opcionais)
  @ApiProperty({ required: false, type: () => Object })
  schedule?: any;

  @ApiProperty({ required: false, type: () => Object })
  doctor?: any;

  @ApiProperty({ required: false, type: () => Object })
  patient?: any;

  @ApiProperty({ required: false, type: () => Object })
  clinicLocation?: any;

  @ApiProperty({ required: false, type: () => Object })
  clinicService?: any;

  @ApiProperty()
  @Expose() // <--- MUITO IMPORTANTE se você usa ClassSerializerInterceptor
  hasReview: boolean;
}
