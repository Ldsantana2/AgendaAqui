import { ApiProperty } from '@nestjs/swagger';
import { ScheduleType } from '@prisma/client';

export class ScheduleResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  clinicId: string;

  @ApiProperty()
  clinicLocationId: string;

  @ApiProperty()
  clinicServiceId: string;

  @ApiProperty({ enum: ScheduleType })
  type: ScheduleType;

  @ApiProperty()
  dayOfWeek: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  duration: number;
}
