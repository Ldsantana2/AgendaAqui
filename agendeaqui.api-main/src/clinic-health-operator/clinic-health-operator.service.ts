import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClinicHealthOperatorService {
  constructor(private readonly prisma: PrismaService) {}

  async assignOperator(clinicId: string, healthOperatorId: string) {
    const exists = await this.prisma.clinicHealthOperator.findUnique({
      where: {
        clinicId_healthOperatorId: { clinicId, healthOperatorId },
      },
    });

    if (exists) {
      throw new ConflictException('Operadora já atribuída à clínica.');
    }

    return this.prisma.clinicHealthOperator.create({
      data: { clinicId, healthOperatorId },
    });
  }

  async removeOperator(clinicId: string, healthOperatorId: string) {
    return this.prisma.clinicHealthOperator.delete({
      where: {
        clinicId_healthOperatorId: { clinicId, healthOperatorId },
      },
    });
  }

  async findOperatorsByClinic(clinicId: string) {
    return this.prisma.clinicHealthOperator.findMany({
      where: { clinicId },
      include: { healthOperator: true },
    });
  }
}
