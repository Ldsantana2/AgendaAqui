import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfirmationStatus } from '@prisma/client';
import { ClinicStatisticsDto } from './dto/clinic-statistics.dto';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getClinicDashboardStatistics(
    clinicId: string,
  ): Promise<ClinicStatisticsDto> {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) {
      throw new NotFoundException(
        `Clínica com ID "${clinicId}" não encontrada.`,
      );
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    const calculateAge = (dob: Date): number => {
      const diff_ms = Date.now() - dob.getTime();
      const age_dt = new Date(diff_ms);
      return Math.abs(age_dt.getUTCFullYear() - 1970);
    };

    const totalPatientsCount = await this.prisma.patient.count({
      where: {
        appointments: {
          some: {
            clinicId: clinicId,
          },
        },
      },
    });

    const appointmentsThisMonthForPaymentType =
      await this.prisma.appointment.findMany({
        where: {
          clinicId: clinicId,
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        select: {
          healthPlanId: true,
        },
      });

    let insurancePatients = 0;
    let privatePatients = 0;

    appointmentsThisMonthForPaymentType.forEach((appointment) => {
      if (appointment.healthPlanId) {
        insurancePatients++;
      } else {
        privatePatients++;
      }
    });

    const appointmentsThisMonthTotal = await this.prisma.appointment.count({
      where: {
        clinicId: clinicId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const appointmentsLastMonthTotal = await this.prisma.appointment.count({
      where: {
        clinicId: clinicId,
        date: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    });

    const canceledAppointmentsCount = await this.prisma.appointment.count({
      where: {
        clinicId: clinicId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        confirmationStatus: {
          in: [ConfirmationStatus.CANCELED, ConfirmationStatus.DECLINED],
        },
      },
    });

    let averageRatingValue = 0;
    const clinicRatings = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
      where: {
        clinic_id: clinicId,
      },
    });
    averageRatingValue = clinicRatings._avg.rating || 0;

    const genderStatsRaw = await this.prisma.patient.groupBy({
      by: ['gender'],
      where: {
        appointments: { some: { clinicId: clinicId } },
      },
      _count: {
        _all: true,
      },
    });

    let malePatients = 0;
    let femalePatients = 0;

    genderStatsRaw.forEach((stat) => {
      const normalizedGender = stat.gender ? stat.gender.toLowerCase() : null;

      if (normalizedGender === 'masculino' || normalizedGender === 'male') {
        malePatients += stat._count._all;
      } else if (
        normalizedGender === 'feminino' ||
        normalizedGender === 'female'
      ) {
        femalePatients += stat._count._all;
      }
    });

    const newPatientsThisMonth = await this.prisma.patient.count({
      where: {
        appointments: { some: { clinicId: clinicId } },
        user: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
      },
    });
    const scheduledAppointmentsCount = await this.prisma.appointment.count({
      where: {
        clinicId: clinicId,
        date: { gte: startOfMonth, lte: endOfMonth },
        confirmationStatus: {
          in: [ConfirmationStatus.PENDING, ConfirmationStatus.CONFIRMED],
        },
      },
    });

    const completedAppointmentsCount = await this.prisma.appointment.count({
      where: {
        clinicId: clinicId,
        confirmationStatus: ConfirmationStatus.COMPLETED,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const appointmentsForRevenue = await this.prisma.appointment.findMany({
      where: {
        clinicId: clinicId,
        date: { gte: startOfMonth, lte: endOfMonth },
        confirmationStatus: {
          in: [
            ConfirmationStatus.COMPLETED,
            ConfirmationStatus.PENDING,
            ConfirmationStatus.CONFIRMED,
          ],
        },
        clinicServiceId: { not: null },
      },
      include: {
        clinicService: {
          select: { price: true },
        },
      },
    });

    let totalRevenueThisMonth = 0;
    appointmentsForRevenue.forEach((app) => {
      if (app.clinicService?.price) {
        totalRevenueThisMonth += app.clinicService.price;
      }
    });

    const completedAppointmentsDetails = await this.prisma.appointment.findMany(
      {
        where: {
          clinicId: clinicId,
          confirmationStatus: ConfirmationStatus.COMPLETED,
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        select: { id: true, startTime: true, endTime: true, date: true },
      },
    );

    let totalDurationMinutes = 0;
    completedAppointmentsDetails.forEach((app) => {
      try {
        const start = new Date(
          `${app.date.toISOString().split('T')[0]}T${app.startTime}:00`,
        );
        const end = new Date(
          `${app.date.toISOString().split('T')[0]}T${app.endTime}:00`,
        );

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          console.warn(
            `Could not parse date/time for appointment ID ${app.id}. Skipping duration calculation.`,
          );
          return;
        }

        const durationMs = end.getTime() - start.getTime();

        if (durationMs > 0) {
          totalDurationMinutes += durationMs / (1000 * 60);
        } else {
          console.warn(
            `Negative or zero duration for appointment ID ${app.id}. Check startTime/endTime.`,
          );
        }
      } catch (e) {
        console.error(
          `Error parsing date/time for appointment ID ${app.id}:`,
          e,
        );
      }
    });
    const averageConsultationDurationMinutes =
      completedAppointmentsDetails.length > 0
        ? parseFloat(
            (
              totalDurationMinutes / completedAppointmentsDetails.length
            ).toFixed(1),
          )
        : 0;

    const allPatientsWithDob = await this.prisma.patient.findMany({
      where: {
        appointments: { some: { clinicId: clinicId } },
        birthDay: { not: null },
      },
      select: { birthDay: true },
    });

    const patientsByAgeGroup: { [key: string]: number } = {};
    allPatientsWithDob.forEach((patient) => {
      if (patient.birthDay) {
        const age = calculateAge(patient.birthDay);
        let group = 'Outros';
        if (age >= 0 && age <= 12) group = '0-12 anos';
        else if (age >= 13 && age <= 18) group = '13-18 anos';
        else if (age >= 19 && age <= 25) group = '19-25 anos';
        else if (age >= 26 && age <= 35) group = '26-35 anos';
        else if (age >= 36 && age <= 50) group = '36-50 anos';
        else if (age >= 51 && age <= 65) group = '51-65 anos';
        else if (age > 65) group = 'Acima de 65 anos';

        patientsByAgeGroup[group] = (patientsByAgeGroup[group] || 0) + 1;
      }
    });

    const mostFrequentServiceResult = await this.prisma.appointment.groupBy({
      by: ['clinicServiceId'],
      where: {
        clinicId: clinicId,
        confirmationStatus: ConfirmationStatus.COMPLETED,
        date: { gte: startOfMonth, lte: endOfMonth },
      },
      _count: { clinicServiceId: true },
      orderBy: { _count: { clinicServiceId: 'desc' } },
      take: 1,
    });

    let mostFrequentService = 'N/A';
    if (mostFrequentServiceResult.length > 0) {
      const topServiceId = mostFrequentServiceResult[0].clinicServiceId;

      if (topServiceId) {
        const topService = await this.prisma.clinicService.findUnique({
          where: { id: topServiceId },
        });
        mostFrequentService = topService?.customName || 'N/A';
      }
    }

    return {
      totalPatients: totalPatientsCount,
      insurancePatients: insurancePatients,
      privatePatients: privatePatients,
      appointmentsThisMonth: appointmentsThisMonthTotal,
      appointmentsLastMonth: appointmentsLastMonthTotal,
      canceledAppointments: canceledAppointmentsCount,
      averageRating: parseFloat(averageRatingValue.toFixed(1)),

      malePatients,
      femalePatients,
      newPatientsThisMonth,
      averageConsultationDurationMinutes,
      patientsByAgeGroup,
      mostFrequentService,
      totalRevenueThisMonth: parseFloat(totalRevenueThisMonth.toFixed(2)),

      scheduledAppointmentsThisMonth: scheduledAppointmentsCount,
      completedAppointmentsThisMonth: completedAppointmentsCount,
    };
  }
}
