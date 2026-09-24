import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { addDays, getDay, format } from 'date-fns';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria um novo bloco de agenda (schedule) para o médico em determinado local.
   */
  async createSchedule(dto: CreateScheduleDto) {
    try {
      // 1. Valida horário inicial e final
      if (dto.startTime >= dto.endTime) {
        throw new BadRequestException(
          'Horário inicial deve ser antes do horário final.',
        );
      }

      // 2. clinicLocationId obrigatório
      if (!dto.clinicLocationId) {
        throw new BadRequestException(
          'Localização da clínica (clinicLocationId) deve ser informada.',
        );
      }

      // 3. Confirma se o doctor existe
      const doctor = await this.prisma.doctor.findUnique({
        where: { id: dto.doctorId },
      });
      if (!doctor) throw new BadRequestException('Doutor não encontrado.');

      // 4. (Opcional) Confirma se a clínica existe (se informada)
      if (dto.clinicId) {
        const clinic = await this.prisma.clinic.findUnique({
          where: { id: dto.clinicId },
        });
        if (!clinic) throw new BadRequestException('Clínica não encontrada.');
      }

      // 5. Confirma se a localização existe
      const location = await this.prisma.clinicLocation.findUnique({
        where: { id: dto.clinicLocationId },
      });
      if (!location)
        throw new BadRequestException('Localização da clínica não encontrada.');

      // 6. Busca todos os schedules do mesmo médico, dia e local (SEM filtrar por serviço)
      const schedules = await this.prisma.schedule.findMany({
        where: {
          doctorId: dto.doctorId,
          dayOfWeek: dto.dayOfWeek,
          clinicLocationId: dto.clinicLocationId,
        },
      });

      // 7. Checa conflitos de horário (sobreposição)
      const requestedStart = dto.startTime;
      const requestedEnd = dto.endTime;
      const hasConflict = schedules.some(
        (s) => requestedStart < s.endTime && requestedEnd > s.startTime,
      );
      if (hasConflict) {
        throw new BadRequestException(
          'Já existe um bloco de agenda nesse horário para o médico neste local.',
        );
      }

      // 8. Cria o novo schedule
      return await this.prisma.schedule.create({ data: dto });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error?.message || 'Erro ao criar bloco de agenda.',
      );
    }
  }

  /**
   * Retorna todos os schedules (regras) de um médico, incluindo local e clínica.
   */
  async getSchedulesByDoctor(doctorId: string) {
    return this.prisma.schedule.findMany({
      where: { doctorId },
      include: {
        clinicLocation: true,
        clinic: true,
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  /**
   * Retorna horários disponíveis para o médico em todos os seus schedules (nos próximos N dias).
   * Todos os slots vêm com date formatada 'yyyy-MM-dd'.
   */

  async getAvailableSlots(doctorId: string, days = 30) {
    const schedules = await this.prisma.schedule.findMany({
      where: { doctorId },
    });

    if (!schedules.length) {
      throw new NotFoundException(
        'Nenhum schedule encontrado para este médico',
      );
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        confirmationStatus: { not: 'DECLINED' },
      },
    });

    const now = new Date();
    const availableSlots: any[] = [];

    for (let i = 0; i < days; i++) {
      const date = addDays(now, i);
      const currDate = format(date, 'yyyy-MM-dd');
      const dayOfWeek = getDay(date);

      for (const schedule of schedules) {
        if (schedule.dayOfWeek === dayOfWeek) {
          // Filtra os appointments do mesmo dia, schedule e local para evitar conflito
          const appointmentsFiltered = appointments.filter((app) => {
            const appDateRaw = app.date as string | Date | undefined;
            if (!appDateRaw) return false;

            const appDate =
              typeof appDateRaw === 'string'
                ? appDateRaw.slice(0, 10)
                : format(appDateRaw, 'yyyy-MM-dd');

            return (
              appDate === currDate &&
              app.scheduleId === schedule.id &&
              app.clinicLocationId === schedule.clinicLocationId
            );
          });

          let [hour, minute] = schedule.startTime.split(':').map(Number);
          const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

          while (hour < endHour || (hour === endHour && minute < endMinute)) {
            const slotTime = `${hour.toString().padStart(2, '0')}:${minute
              .toString()
              .padStart(2, '0')}`;
            const slotEnd = this.calculateEndTime(slotTime, schedule.duration);

            const slotStartNorm = this.normalizeTime(slotTime);
            const slotEndNorm = this.normalizeTime(slotEnd);

            const alreadyBooked = appointmentsFiltered.some((app) => {
              const appStartNorm = this.normalizeTime(app.startTime);
              const appEndNorm = this.normalizeTime(app.endTime);

              return slotStartNorm < appEndNorm && slotEndNorm > appStartNorm;
            });

            if (!alreadyBooked) {
              availableSlots.push({
                date: currDate,
                dayOfWeek,
                startTime: slotTime,
                endTime: slotEnd,
                duration: schedule.duration,
                scheduleId: schedule.id,
                clinicLocationId: schedule.clinicLocationId,
                doctorId: schedule.doctorId,
              });
            }

            minute += schedule.duration;
            if (minute >= 60) {
              hour += 1;
              minute -= 60;
            }
          }
        }
      }
    }

    return availableSlots;
  }

  // Coloque dentro da classe também:
  private normalizeTime(str: string) {
    if (!str) return '';
    const [h, m] = str.split(':').map(Number);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  /**
   * Retorna o próximo slot disponível para um médico.
   */
  async getNextAvailableSlot(doctorId: string, days = 30) {
    const availableSlots = await this.getAvailableSlots(doctorId, days);
    if (availableSlots.length === 0) {
      return { message: 'Nenhum horário disponível encontrado' };
    }
    return availableSlots[0];
  }

  /**
   * Retorna todos os horários disponíveis para determinado local (clinicLocationId) nos próximos N dias.
   */
  async getAvailableSlotsByLocation(clinicLocationId: string, days = 30) {
    const schedules = await this.prisma.schedule.findMany({
      where: { clinicLocationId },
      include: { doctor: true },
    });

    if (!schedules.length) return [];

    const scheduleIds = schedules.map((s) => s.id);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        scheduleId: { in: scheduleIds },
        confirmationStatus: { not: 'DECLINED' },
      },
    });

    const now = new Date();
    const slots: any[] = [];

    for (let i = 0; i < days; i++) {
      const date = addDays(now, i);
      const dayOfWeek = getDay(date);

      for (const schedule of schedules) {
        if (schedule.dayOfWeek === dayOfWeek) {
          let [hour, minute] = schedule.startTime.split(':').map(Number);
          const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

          while (hour < endHour || (hour === endHour && minute < endMinute)) {
            const slotTime = `${hour.toString().padStart(2, '0')}:${minute
              .toString()
              .padStart(2, '0')}`;
            const slotEnd = this.calculateEndTime(slotTime, schedule.duration);

            const alreadyBooked = appointments.some((app) => {
              const appDate = format(new Date(app.date), 'yyyy-MM-dd');
              const currDate = format(date, 'yyyy-MM-dd');
              if (appDate !== currDate) return false;

              if (
                app.scheduleId !== schedule.id ||
                app.clinicLocationId !== schedule.clinicLocationId
              ) {
                return false;
              }

              // Checa sobreposição de horários
              return slotTime < app.endTime && slotEnd > app.startTime;
            });

            if (!alreadyBooked) {
              slots.push({
                date: format(date, 'yyyy-MM-dd'),
                dayOfWeek,
                startTime: slotTime,
                endTime: slotEnd,
                duration: schedule.duration,
                scheduleId: schedule.id,
                clinicLocationId: schedule.clinicLocationId,
                doctorId: schedule.doctorId,
                doctor: schedule.doctor,
              });
            }

            minute += schedule.duration;
            if (minute >= 60) {
              hour += 1;
              minute -= 60;
            }
          }
        }
      }
    }
    return slots;
  }

  async getAvailableSlotsByLocationAndDoctor(
    doctorId: string,
    clinicLocationId: string,
    days = 30,
  ) {
    const schedules = await this.prisma.schedule.findMany({
      where: {
        doctorId,
        clinicLocationId,
      },
    });
    if (!schedules.length) return [];

    const scheduleIds = schedules.map((s) => s.id);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctorId,
        clinicLocationId,
        scheduleId: { in: scheduleIds },
        confirmationStatus: { not: 'DECLINED' },
      },
    });

    const now = new Date();
    const slots: any[] = [];

    for (let i = 0; i < days; i++) {
      const date = addDays(now, i);
      const dayOfWeek = getDay(date);

      for (const schedule of schedules) {
        if (schedule.dayOfWeek === dayOfWeek) {
          let [hour, minute] = schedule.startTime.split(':').map(Number);
          const [endHour, endMinute] = schedule.endTime.split(':').map(Number);

          while (hour < endHour || (hour === endHour && minute < endMinute)) {
            const slotTime = `${hour.toString().padStart(2, '0')}:${minute
              .toString()
              .padStart(2, '0')}`;
            const slotEnd = this.calculateEndTime(slotTime, schedule.duration);

            const alreadyBooked = appointments.some((app) => {
              const appDate = format(new Date(app.date), 'yyyy-MM-dd');
              const currDate = format(date, 'yyyy-MM-dd');
              if (appDate !== currDate) return false;

              if (
                app.scheduleId !== schedule.id ||
                app.clinicLocationId !== schedule.clinicLocationId
              ) {
                return false;
              }

              // Sobreposição
              return slotTime < app.endTime && slotEnd > app.startTime;
            });

            if (!alreadyBooked) {
              slots.push({
                date: format(date, 'yyyy-MM-dd'),
                dayOfWeek,
                startTime: slotTime,
                endTime: slotEnd,
                duration: schedule.duration,
                scheduleId: schedule.id,
                clinicLocationId: schedule.clinicLocationId,
                doctorId: schedule.doctorId,
              });
            }

            minute += schedule.duration;
            if (minute >= 60) {
              hour += 1;
              minute -= 60;
            }
          }
        }
      }
    }
    return slots;
  }

  /**
   * Função utilitária: calcula o horário de término do slot a partir do horário inicial e duração.
   */
  private calculateEndTime(startTime: string, duration: number): string {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    let totalMinutes = startHour * 60 + startMinute + duration;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute
      .toString()
      .padStart(2, '0')}`;
  }

  /**
   * Retorna todos os schedules (regras) de uma clínica.
   */
  async getSchedulesByClinic(clinicId: string) {
    return this.prisma.schedule.findMany({
      where: { clinicId },
      include: {
        doctor: true,
        clinic: true,
        clinicLocation: true,
      },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  /**
   * Retorna um schedule específico por ID.
   */
  async getScheduleById(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: {
        doctor: true,
        clinic: true,
        clinicLocation: true,
      },
    });
    if (!schedule) throw new NotFoundException('Schedule não encontrado.');
    return schedule;
  }

  /**
   * Atualiza as regras (schedules) de um médico, retornando quais agendamentos futuros seriam afetados.
   */
  async updateSchedulesByDoctor(
    doctorId: string,
    dto: UpdateScheduleDto,
  ): Promise<{ affectedAppointments: any[] }> {
    const oldRules = await this.prisma.schedule.findMany({
      where: { doctorId },
    });

    const removedRules = oldRules.filter(
      (oldRule) =>
        !dto.rules.some(
          (newRule) =>
            newRule.dayOfWeek === oldRule.dayOfWeek &&
            newRule.startTime === oldRule.startTime &&
            newRule.endTime === oldRule.endTime &&
            newRule.clinicLocationId === oldRule.clinicLocationId,
        ),
    );

    const now = new Date();
    let affectedAppointments: any[] = [];
    for (const rule of removedRules) {
      const futureAppointments = await this.prisma.appointment.findMany({
        where: {
          doctorId,
          scheduleId: rule.id,
          date: { gte: now },
          confirmationStatus: { not: 'DECLINED' },
        },
      });
      // Formata date para cada appointment
      affectedAppointments = affectedAppointments.concat(
        futureAppointments.map((app) => ({
          ...app,
          date: format(new Date(app.date), 'yyyy-MM-dd'),
        })),
      );
    }

    if (affectedAppointments.length > 0) {
      return { affectedAppointments };
    }

    await this.prisma.schedule.deleteMany({ where: { doctorId } });
    for (const rule of dto.rules) {
      await this.prisma.schedule.create({
        data: { doctorId, ...rule },
      });
    }

    return { affectedAppointments: [] };
  }

  /**
   * Deleta um schedule pelo id.
   */
  async deleteSchedule(id: string) {
    return this.prisma.schedule.delete({ where: { id } });
  }
}
