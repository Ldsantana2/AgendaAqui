import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHealthPlanTypeDto } from './dto/create-health-plan-type.dto';
import { UpdateHealthPlanTypeDto } from './dto/update-health-plan-type.dto';

@Injectable()
export class HealthPlanTypeService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateHealthPlanTypeDto) {
    return this.prisma.healthPlanType.create({ data: dto });
  }

  findAll() {
    return this.prisma.healthPlanType.findMany();
  }

  findOne(id: string) {
    return this.prisma.healthPlanType.findUnique({ where: { id } });
  }

  async findIdByPlanName(planName: string) {
    const plan = await this.prisma.healthPlanType.findFirst({
      where: { planName },
      select: { id: true },
    });

    if (!plan) {
      throw new Error('Plano de saúde não encontrado com esse nome.');
    }

    return plan.id;
  }

  async findByHealthOperatorId(healthOperatorId: string) {
    return this.prisma.healthPlanType.findMany({
      where: { healthOperatorId },
      orderBy: { planName: 'asc' }, // opcional: ordena alfabeticamente
    });
  }

  update(id: string, dto: UpdateHealthPlanTypeDto) {
    return this.prisma.healthPlanType.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.healthPlanType.delete({ where: { id } });
  }
}
