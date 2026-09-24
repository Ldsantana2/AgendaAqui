import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  Delete,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('create')
  async createSchedule(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.createSchedule(dto);
  }

  @Get('doctor/:doctorId')
  async getSchedulesByDoctor(@Param('doctorId') doctorId: string) {
    const data = await this.scheduleService.getSchedulesByDoctor(doctorId);
    return {
      data,
      isSuccess: true,
      message: 'Request successful',
    };
  }

  // Todos horários disponíveis (sem agendamento)
  @Get('doctor/:doctorId/available-slots')
  async getAvailableSlots(
    @Param('doctorId') doctorId: string,
    @Query('days') days?: string,
  ) {
    const nDays = days ? Number(days) : 30;
    return await this.scheduleService.getAvailableSlots(doctorId, nDays);
  }

  // Próximo horário disponível
  @Get('doctor/:doctorId/next-available-slot')
  async getNextAvailableSlot(
    @Param('doctorId') doctorId: string,
    @Query('days') days?: string,
  ) {
    const nDays = days ? Number(days) : 30;
    return await this.scheduleService.getNextAvailableSlot(doctorId, nDays);
  }

  // Horários disponíveis do location (todos médicos)
  @Get('by-location')
  async getAvailableSlotsByLocation(
    @Query('clinicLocationId') clinicLocationId: string,
    @Query('days') days?: string,
  ) {
    const nDays = days ? Number(days) : 30;
    return this.scheduleService.getAvailableSlotsByLocation(
      clinicLocationId,
      nDays,
    );
  }

  // Horários disponíveis do doctor naquele location
  @Get('by-location/doctor/:doctorId')
  async getAvailableSlotsByLocationAndDoctor(
    @Param('doctorId') doctorId: string,
    @Query('clinicLocationId') clinicLocationId: string,
    @Query('days') days?: string,
  ) {
    const nDays = days ? Number(days) : 30;
    return this.scheduleService.getAvailableSlotsByLocationAndDoctor(
      doctorId,
      clinicLocationId,
      nDays,
    );
  }

  @Get('clinic/:clinicId')
  async getSchedulesByClinic(@Param('clinicId') clinicId: string) {
    return this.scheduleService.getSchedulesByClinic(clinicId);
  }

  @Get(':id')
  async getScheduleById(@Param('id') id: string) {
    return this.scheduleService.getScheduleById(id);
  }

  @Put('doctor/:doctorId')
  async updateSchedulesByDoctor(
    @Param('doctorId') doctorId: string,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedulesByDoctor(doctorId, dto);
  }

  @Delete(':id')
  async deleteSchedule(@Param('id') id: string) {
    return this.scheduleService.deleteSchedule(id);
  }
}
