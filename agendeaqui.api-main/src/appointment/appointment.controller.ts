import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  Redirect,
  UseGuards,
  Req,
  NotFoundException,
  Put,
  HttpException,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentResponseDto } from './dto/appointment-response.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ConfirmationStatus } from '@prisma/client';

interface AuthRequest extends Request {
  user: { id: string };
}

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  /** Cria um novo agendamento */
  @Post()
  async create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentService.create(dto);
  }

  /** Lista todos os appointments de um paciente */
  @Get('patient/:patientId')
  async findByPatient(@Param('patientId') patientId: string) {
    return this.appointmentService.findByPatient(patientId);
  }

  /** Confirma um appointment pelo ID (GET, redireciona) */
  @Get('confirm/:id')
  @Redirect('/appointment-confirmed')
  async confirmAppointment(@Param('id') id: string) {
    await this.appointmentService.confirmAppointment(id);
    return { url: '/appointment-confirmed' };
  }

  /** Cancela (declina) um appointment pelo ID (GET, redireciona) */
  @Get('cancel/:id')
  @Redirect('/appointment-declined')
  async declineAppointment(@Param('id') id: string) {
    await this.appointmentService.declineAppointment(id);
    return { url: '/appointment-declined' };
  }

  /** Busca appointments por localização da clínica */
  @Get('by-location')
  async findByLocation(@Query('clinicLocationId') clinicLocationId?: string) {
    return this.appointmentService.findByLocation(clinicLocationId);
  }

  /** Busca appointments por serviço da clínica */
  @Get('by-service')
  async findByService(@Query('clinicServiceId') clinicServiceId?: string) {
    return this.appointmentService.findByService(clinicServiceId);
  }

  /** Busca todos os appointments de uma clínica pelo ID */
  @Get('clinic/:clinicId')
  async findByClinic(@Param('clinicId') clinicId: string) {
    return this.appointmentService.findByClinic(clinicId);
  }

  /** Busca todos os appointments de um médico pelo ID */
  @Get('doctor/:doctorId')
  async findByDoctor(@Param('doctorId') doctorId: string) {
    return this.appointmentService.findByDoctor(doctorId);
  }

  /** Cancela (declina) um appointment pelo ID (DELETE) */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async cancel(@Param('id') id: string) {
    return this.appointmentService.cancel(id);
  }

  /** Lista os appointments do paciente logado, organizados por status */

  @Get('myAppointments')
  @UseGuards(AuthGuard('jwt'))
  async getMyAppointments(
    @Req() req: AuthRequest,
    @Query('status') status?: string,
  ) {
    const userId = req.user.id;
    const patientId =
      await this.appointmentService.findPatientIdByUserId(userId);

    if (!patientId) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const statusEnum = Object.values(ConfirmationStatus).includes(
      status as ConfirmationStatus,
    )
      ? (status as ConfirmationStatus)
      : undefined;

    return this.appointmentService.findMyAppointments(patientId, statusEnum);
  }

  /** Adiciona um review para um appointment (associado a uma clínica) */
  @Post(':id/review')
  @UseGuards(AuthGuard('jwt'))
  async addReview(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() reviewData,
  ) {
    const patientId = await this.appointmentService.findPatientIdByUserId(
      req.user.id,
    );

    if (!patientId) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    const appointment = await this.appointmentService.findAppointmentById(id);

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada.');
    }

    let clinicId = appointment.clinicId;

    // Se não tiver clinicId direto, tenta pegar da relação com clinicLocation
    if (!clinicId && appointment.clinicLocation?.clinic?.id) {
      clinicId = appointment.clinicLocation.clinic.id;
    }

    if (!clinicId) {
      throw new BadRequestException(
        'Esta consulta não está associada a uma clínica.',
      );
    }

    return this.appointmentService.addReview(
      id,
      reviewData,
      patientId,
      clinicId,
    );
  }

  /** Permite remarcar um appointment (PUT) */
  @Put(':id/reschedule')
  @UseGuards(AuthGuard('jwt'))
  async rescheduleAppointment(
    @Req() req: AuthRequest,
    @Param('id') appointmentId: string,
    @Body() body,
  ) {
    const { newDate, newDayOfWeek, newStartTime } = body;
    const userId = req.user.id;

    try {
      const patientId =
        await this.appointmentService.findPatientIdByUserId(userId);
      if (!patientId) {
        throw new NotFoundException('Erro: Paciente não encontrado.');
      }

      const updatedAppointment =
        await this.appointmentService.rescheduleAppointment(
          appointmentId,
          newDate,
          newDayOfWeek,
          newStartTime,
          patientId,
        );

      return {
        isSuccess: true,
        message: 'Consulta remarcada com sucesso!',
        data: updatedAppointment,
      };
    } catch (error) {
      throw new HttpException(
        { isSuccess: false, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt')) // Opcional, dependendo se você quer que a consulta seja pública ou só para usuários logados
  async findOneAppointmentById(@Param('id') id: string) {
    const appointment = await this.appointmentService.findAppointmentById(id); // Assumindo que este método existe no seu service

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada.');
    }
    return {
      isSuccess: true,
      data: appointment,
    };
  }
}
