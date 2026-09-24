import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHealthPlanDto } from './dto/create-health-plan.dto';
import { UpdateHealthPlanDto } from './dto/update-health-plan.dto';

@Injectable()
export class HealthPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateHealthPlanDto) {
    try {
      const patient = await this.prisma.patient.findUnique({
        where: { id: dto.patientId },
      });

      if (!patient) {
        throw new NotFoundException('Paciente não encontrado.');
      }

      const planType = await this.prisma.healthPlanType.findUnique({
        where: { id: dto.healthPlanTypeId },
      });

      if (!planType) {
        throw new NotFoundException('Tipo de plano não encontrado.');
      }

      const existingPlans = await this.prisma.healthPlan.findMany({
        where: { patientId: dto.patientId },
      });

      const isPrimary = existingPlans.length === 0;

      const validUntilDate = new Date(dto.validUntil);

      const healthPlan = await this.prisma.healthPlan.create({
        data: {
          healthOperatorId: dto.healthOperatorId,
          patientId: dto.patientId, // ✅ REQUIRED!
          number: dto.number,
          validUntil: validUntilDate.toISOString(),
          planName: planType.planName,
          situation: planType.situation,
          accommodation: planType.accommodation,
          isPrimary,
        },
      });

      return {
        data: healthPlan,
        isSuccess: true,
        message: 'Plano de saúde criado com sucesso.',
      };
    } catch (error) {
      return {
        data: null,
        isSuccess: false,
        message: error.message,
      };
    }
  }

  async setPrimaryHealthPlan(planId: string) {
    const plan = await this.prisma.healthPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plano de saúde não encontrado.');
    }

    // Unset all other primary flags for the same patient
    await this.prisma.healthPlan.updateMany({
      where: {
        patientId: plan.patientId,
        isPrimary: true,
      },
      data: {
        isPrimary: false,
      },
    });

    // Set selected as primary
    const updated = await this.prisma.healthPlan.update({
      where: { id: planId },
      data: { isPrimary: true },
    });

    return {
      data: updated,
      isSuccess: true,
      message: 'Plano de saúde definido como primário.',
    };
  }

  async findAll() {
    return this.prisma.healthPlan.findMany({
      include: {
        healthOperator: true,
        patient: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.healthPlan.findUnique({
      where: { id },
      include: {
        healthOperator: true,
        patient: true,
      },
    });
  }

  async findByPatient(patientId: string) {
    return this.prisma.healthPlan.findMany({
      where: { patientId },
      include: {
        healthOperator: true,
      },
    });
  }

  async findPrimaryByPatient(patientId: string) {
    return this.prisma.healthPlan.findFirst({
      where: {
        patientId,
        isPrimary: true,
      },
      include: {
        healthOperator: true,
      },
    });
  }

  async update(id: string, dto: UpdateHealthPlanDto) {
    try {
      const existing = await this.prisma.healthPlan.findUnique({
        where: { id },
      });

      if (!existing) {
        return {
          data: null,
          isSuccess: false,
          message: 'Plano de saúde não encontrado.',
        };
      }

      const updated = await this.prisma.healthPlan.update({
        where: { id },
        data: {
          healthOperatorId: dto.healthOperatorId,
          number: dto.number,
          validUntil: dto.validUntil
            ? new Date(dto.validUntil).toISOString()
            : undefined,
        },
      });

      return {
        data: updated,
        isSuccess: true,
        message: 'Plano de saúde atualizado com sucesso.',
      };
    } catch (error) {
      return {
        data: null,
        isSuccess: false,
        message: 'Erro ao atualizar plano de saúde: ' + error.message,
      };
    }
  }

  async remove(id: string) {
    return this.prisma.healthPlan.delete({ where: { id } });
  }
}
