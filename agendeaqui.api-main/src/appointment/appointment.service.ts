import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { format, parseISO } from 'date-fns';
import { ConfirmationStatus } from '@prisma/client';

@Injectable()
export class AppointmentService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) { }

  /**
   * Cria um novo agendamento, validando conflitos de horário.
   */
  async create(dto: CreateAppointmentDto) {
    try {
      const date = new Date(dto.date);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new BadRequestException(
          'Não é possível agendar em datas passadas.',
        );
      }

      // Busca schedule
      const schedule = await this.prisma.schedule.findUnique({
        where: { id: dto.scheduleId },
        include: { doctor: true },
      });
      if (!schedule)
        throw new NotFoundException('Bloco de agenda não encontrado.');

      // Verifica se o horário solicitado está DENTRO do intervalo do slot do schedule
      const scheduleStart = schedule.startTime;
      const scheduleEnd = schedule.endTime;
      if (dto.startTime < scheduleStart || dto.endTime > scheduleEnd) {
        throw new BadRequestException(
          'Horário solicitado fora do horário do slot da agenda.',
        );
      }

      // Verifica se a duração do appointment é compatível com a duração do slot
      const [startHour, startMin] = dto.startTime.split(':').map(Number);
      const [endHour, endMin] = dto.endTime.split(':').map(Number);
      const requestedDuration =
        endHour * 60 + endMin - (startHour * 60 + startMin);
      if (requestedDuration !== schedule.duration) {
        throw new BadRequestException(
          `A duração solicitada (${requestedDuration}min) não corresponde à duração do slot (${schedule.duration}min).`,
        );
      }

      // Garante que o horário de início seja antes do horário de término
      if (dto.startTime >= dto.endTime) {
        throw new BadRequestException(
          'O horário inicial deve ser antes do horário final.',
        );
      }

      // CONFLITO DE HORÁRIO - FILTRO POR DATA!
      const overlappingAppointment = await this.prisma.appointment.findFirst({
        where: {
          doctorId: dto.doctorId,
          clinicLocationId: dto.clinicLocationId,
          date: date, // <-- OBRIGATÓRIO: filtrar só appointments do mesmo dia!
          confirmationStatus: { not: 'DECLINED' },
          AND: [
            { startTime: { lt: dto.endTime } },
            { endTime: { gt: dto.startTime } },
          ],
        },
      });

      if (overlappingAppointment) {
        throw new BadRequestException(
          'O médico já possui um agendamento em conflito nesse horário e local.',
        );
      }

      // Conflito para o paciente
      const overlappingPatientAppointment =
        await this.prisma.appointment.findFirst({
          where: {
            patientId: dto.patientId,
            clinicLocationId: dto.clinicLocationId,
            date: date, // <-- FILTRAR DATA AQUI TAMBÉM
            confirmationStatus: { not: 'DECLINED' },
            AND: [
              { startTime: { lt: dto.endTime } },
              { endTime: { gt: dto.startTime } },
            ],
          },
        });

      if (overlappingPatientAppointment) {
        throw new BadRequestException(
          'O paciente já possui um agendamento em conflito nesse horário e local.',
        );
      }

      // Busca paciente
      const patient = await this.prisma.patient.findUnique({
        where: { id: dto.patientId },
        include: { user: true },
      });
      if (!patient) throw new NotFoundException('Paciente não encontrado.');

      // Cria agendamento
      const appointment = await this.prisma.appointment.create({
        data: {
          doctorId: dto.doctorId,
          scheduleId: dto.scheduleId,
          patientId: dto.patientId,
          date: date,
          startTime: dto.startTime,
          endTime: dto.endTime,
          confirmationStatus: 'PENDING',
          clinicLocationId: dto.clinicLocationId,
          clinicServiceId: dto.clinicServiceId,
          healthPlanId: dto.healthPlanId ?? null,
          clinicId: dto.clinicId,
          dataConsentSharing: dto.dataConsentSharing ?? false,
        },
      });

      // E-mail de confirmação (pode remover se não quiser)
      const doctorName = schedule.doctor
        ? `${schedule.doctor.name} ${schedule.doctor.surname}`
        : 'Médico não definido';
      const appointmentDate = format(date, 'dd/MM/yyyy');
      const appointmentTime = `${dto.startTime} - ${dto.endTime}`;
      const baseUrl =
        this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
      await this.emailService.sendAppointmentConfirmation(
        patient.user.email,
        `${patient.name} ${patient.surname}`,
        appointment,
        doctorName,
        appointmentDate,
        appointmentTime,
        baseUrl,
      );

      return {
        ...appointment,
        date: format(appointment.date, 'yyyy-MM-dd'),
      };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new BadRequestException(
        error?.message || 'Erro ao criar agendamento.',
      );
    }
  }

  /**
   * Retorna todos os appointments de um paciente.
   */
  async findByPatient(patientId: string) {
    const results = await this.prisma.appointment.findMany({
      where: { patientId },
      include: {
        schedule: { include: { doctor: true } },
        doctor: true,
        patient: true,
        clinicLocation: true,
        clinicService: true,
        healthPlan: true,
        Clinic: true,
      },
      orderBy: { date: 'asc' },
    });
    return results.map((a) => ({
      ...a,
      date: a.date,
    }));
  }

  /**
   * Retorna o patientId a partir do userId.
   */
  async findPatientIdByUserId(userId: string): Promise<string | null> {
    const patient = await this.prisma.patient.findUnique({
      where: { userId },
      select: { id: true },
    }
    );
    return patient?.id ?? null;
  }

  /**
   * Retorna todos os appointments de um médico.
   */
  async findByDoctor(doctorId: string) {
    const results = await this.prisma.appointment.findMany({
      where: { doctorId },
      include: {
        schedule: { include: { doctor: true } },
        doctor: true,
        patient: true,
        clinicLocation: true,
        clinicService: true,
        healthPlan: true,
        Clinic: true,
      },
      orderBy: { date: 'asc' },
    });
    return results.map((a) => ({
      ...a,
      date: a.date,
    }));
  }

  /**
   * Retorna todos os appointments de uma clínica.
   */
  async findByClinic(clinicId: string) {
    // 1. Busca todos os clinicLocationId da clínica
    const locations = await this.prisma.clinicLocation.findMany({
      where: { clinicId },
      select: { id: true },
    });
    const clinicLocationIds = locations.map((loc) => loc.id);

    // 2. Busca todos os appointments desses locations
    const results = await this.prisma.appointment.findMany({
      where: {
        clinicLocationId: { in: clinicLocationIds },
      },
      include: {
        schedule: { include: { doctor: true } },
        doctor: true,
        patient: true,
        clinicLocation: true,
        clinicService: true,
        healthPlan: true,
        Clinic: true,
      },
      orderBy: { date: 'asc' },
    });
    return results.map((a) => ({
      ...a,
      date: a.date,
    }));
  }

  /**
   * Cancela um agendamento (altera status para DECLINED).
   */
  async cancel(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment) throw new NotFoundException('Consulta não encontrada.');

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { confirmationStatus: ConfirmationStatus.DECLINED },
    });

    return {
      ...updatedAppointment,
      date: updatedAppointment.date,
    };
  }

  /**
   * Confirma um agendamento (altera status para CONFIRMED).
   */
  async confirmAppointment(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment)
      throw new NotFoundException('Agendamento não encontrado.');
    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { confirmationStatus: 'CONFIRMED' },
    });
    return {
      ...updated,
      date: updated.date,
    };
  }

  /**
   * Recusa/cancela um agendamento (altera status para DECLINED).
   */
  async declineAppointment(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment)
      throw new NotFoundException('Agendamento não encontrado.');
    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { confirmationStatus: 'DECLINED' },
    });
    return {
      ...updated,
      date: updated.date,
    };
  }

  /**
   * Retorna appointments por local (apenas clinicLocationId agora).
   */
  async findByLocation(clinicLocationId?: string) {
    if (!clinicLocationId) {
      throw new BadRequestException('Informe o ID de localização da clínica.');
    }
    const results = await this.prisma.appointment.findMany({
      where: { clinicLocationId },
      include: {
        doctor: true,
        patient: true,
        clinicLocation: true,
        clinicService: true,
        schedule: true,
        healthPlan: true,
        Clinic: true,
      },
      orderBy: { date: 'asc' },
    });
    return results.map((a) => ({
      ...a,
      date: a.date,
    }));
  }

  /**
   * Retorna appointments por serviço de clínica.
   */
  async findByService(clinicServiceId?: string) {
    if (!clinicServiceId) {
      throw new BadRequestException('Informe o ID de serviço.');
    }
    const results = await this.prisma.appointment.findMany({
      where: { clinicServiceId },
      include: {
        doctor: true,
        patient: true,
        clinicLocation: true,
        clinicService: true,
        schedule: true,
        healthPlan: true,
        Clinic: true,
      },
      orderBy: { date: 'asc' },
    });
    return results.map((a) => ({
      ...a,
      date: a.date,
    }));
  }

  async findMyAppointments(patientId: string, status?: ConfirmationStatus) {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId, ...(status ? { confirmationStatus: status } : {}) },
      include: {
        Clinic: {
          select: {
            id: true,
            name: true,
          },
        },
        clinicLocation: {
          select: {
            id: true,
            address: true,
            city: true,
            state: true,
            cep: true,
            number: true,
            complement: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            surname: true,

            specialtyLinks: {
              where: { isPrimary: true },
              select: {
                specialty: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        patient: { select: { id: true, name: true, surname: true } },
        schedule: { select: { id: true } },
        clinicService: { select: { id: true } },
        healthPlan: true,
        review: {
          select: {
            id: true,
            comment: true,
            rating: true
          }
        }
      },
      orderBy: { date: 'asc' },
    });

    const now = new Date();

    const organizedAppointments = appointments.reduce(
      (acc, appointment) => {
        // Formata a especialidade do médico
        const doctorSpecialty =
          appointment.doctor?.specialtyLinks?.[0]?.specialty?.name ||
          'Especialidade não informada';

        // Constrói o endereço completo da clínica
        const clinicAddress = appointment.clinicLocation
          ? `${appointment.clinicLocation.address}, ${appointment.clinicLocation.number}${appointment.clinicLocation.complement ? `, ${appointment.clinicLocation.complement}` : ''}, ${appointment.clinicLocation.city} - ${appointment.clinicLocation.state}, ${appointment.clinicLocation.cep}`
          : 'Endereço não informado';

        const appointmentFullDateTime = new Date(
          `${appointment.date}T${appointment.startTime}:00`,
        );
        const hasAppointmentTimePassed = appointmentFullDateTime < now;

        const hasReview = !!appointment.review;

        const formatted = {
          ...appointment,
          date: appointment.date,
          clinicName: appointment.Clinic?.name || 'Clínica não informada',
          clinicAddress: clinicAddress,
          doctorSpecialty: doctorSpecialty,
          doctorName: `Dr. ${appointment.doctor.name} ${appointment.doctor.surname}`,
          hasReview: hasReview,
        };

        if (
          appointment.confirmationStatus === ConfirmationStatus.DECLINED ||
          appointment.confirmationStatus === ConfirmationStatus.CANCELED
        ) {
          acc.CANCELADA.push(formatted);
        } else if (
          appointment.confirmationStatus === ConfirmationStatus.COMPLETED ||
          hasAppointmentTimePassed
        ) {
          acc.REALIZADA.push(formatted);
        } else if (
          appointment.confirmationStatus === ConfirmationStatus.CONFIRMED ||
          appointment.confirmationStatus === ConfirmationStatus.PENDING
        ) {
          acc.AGENDADA.push(formatted);
        }
        return acc;
      },
      { AGENDADA: [], REALIZADA: [], CANCELADA: [] } as {
        AGENDADA: any[];
        REALIZADA: any[];
        CANCELADA: any[];
      },
    );

    await this.prisma.appointment.updateMany({
      where: {
        date: { lt: now },
        confirmationStatus: ConfirmationStatus.PENDING,
      },
      data: { confirmationStatus: ConfirmationStatus.COMPLETED },
    });

    return organizedAppointments;
  }
  /**
   * Cria um review para um appointment (clínica).
   */

  async addReview(
    appointmentId: string,
    reviewData: { rating: number; comment: string },
    patientId: string,
    clinicId: string,
  ) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado.');
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        review: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada.');
    }

    if (appointment.patientId !== patientId) {
      throw new ForbiddenException(
        'Você não tem permissão para avaliar esta consulta.',
      );
    }
    if (appointment.review) {
      throw new BadRequestException(
        'Você já fez uma avaliação para esta consulta.',
      );
    }

    return this.prisma.review.create({
      data: {
        appointmentId: appointmentId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        patient_id: patientId,
        clinic_id: clinicId,
      },
    });
  }

  /**
   * Retorna os dados de um appointment pelo id.
   */
  async findAppointmentById(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        Clinic: true,
        clinicLocation: {
          include: {
            clinic: true,
          },
        },
      },
    });
    return appointment
      ? {
        ...appointment,
        date: appointment.date,
      }
      : null;
  }

  /**
   * Permite remarcar um appointment, se possível.
   */
  async rescheduleAppointment(
    appointmentId: string,
    newDate: string,
    newDayOfWeek: string,
    newStartTime: string,
    patientId: string,
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      throw new Error('Erro: Data inválida. Formato esperado: YYYY-MM-DD.');
    }

    const newDayOfWeekNumber = Number(newDayOfWeek);
    if (
      isNaN(newDayOfWeekNumber) ||
      newDayOfWeekNumber < 0 ||
      newDayOfWeekNumber > 6
    ) {
      throw new Error(
        'Erro: Dia da semana inválido. Escolha um número entre 0 e 6.',
      );
    }

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      select: { doctorId: true, patientId: true, scheduleId: true },
    });

    if (!appointment) {
      throw new Error('Erro: Consulta não encontrada.');
    }

    if (appointment.patientId !== patientId) {
      throw new Error(
        'Erro: Você não tem permissão para remarcar esta consulta.',
      );
    }

    // Busca horários disponíveis
    const availableSlots = await this.prisma.schedule.findMany({
      where: {
        doctorId: appointment.doctorId,
        dayOfWeek: newDayOfWeekNumber,
      },
      select: { startTime: true },
    });

    const availableTimes = availableSlots.map((slot) => slot.startTime);
    const formattedStartTime = newStartTime.padStart(5, '0');
    if (!availableTimes.includes(formattedStartTime)) {
      throw new Error('Erro: O horário selecionado não está disponível.');
    }

    // Atualiza a consulta
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: newDate,
        startTime: newStartTime,
        confirmationStatus: 'PENDING',
      },
    });

    return {
      ...updatedAppointment,
      date: updatedAppointment.date,
    };
  }
}
