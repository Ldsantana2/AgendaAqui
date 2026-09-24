import { ScheduleType } from '@prisma/client';

export class ScheduleRuleDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  duration: number;
  type: ScheduleType;
  clinicLocationId: string;
  clinicServiceId: string;
}
