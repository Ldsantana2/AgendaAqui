import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClinicTreatedAreaService {
  constructor(private readonly prisma: PrismaService) {}

  async assignTreatedArea(
    clinicId: string,
    treatedAreaId: string,
  ): Promise<void> {
    const clinic = await this.prisma.clinic.findUnique({
      where: { id: clinicId },
    });
    if (!clinic) {
      throw new NotFoundException('Clínica não encontrada.');
    }

    const treatedArea = await this.prisma.treatedArea.findUnique({
      where: { id: treatedAreaId },
    });
    if (!treatedArea) {
      throw new NotFoundException('Área tratada não encontrada.');
    }

    const existingAssociation = await this.prisma.clinicTreatedArea.findFirst({
      where: {
        clinicId,
        treatedAreaId,
      },
    });

    if (existingAssociation) {
      throw new BadRequestException(
        'A área tratada já está associada a esta clínica.',
      );
    }

    await this.prisma.clinicTreatedArea.create({
      data: {
        clinicId,
        treatedAreaId,
      },
    });
  }

  async getTreatedAreasByClinic(clinicId: string) {
    return this.prisma.clinicTreatedArea.findMany({
      where: { clinicId },
      include: {
        treatedArea: true,
      },
    });
  }

  async removeTreatedArea(
    clinicId: string,
    treatedAreaId: string,
  ): Promise<void> {
    const existingAssociation = await this.prisma.clinicTreatedArea.findFirst({
      where: {
        clinicId,
        treatedAreaId,
      },
    });

    if (!existingAssociation) {
      throw new BadRequestException(
        'A área tratada não está associada a esta clínica.',
      );
    }

    await this.prisma.clinicTreatedArea.delete({
      where: {
        id: existingAssociation.id,
      },
    });
  }
}
