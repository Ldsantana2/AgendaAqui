import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClinicSpecialtyDto } from './dto/create-clinic-specialty.dto';

@Injectable()
export class ClinicSpecialtyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClinicSpecialtyDto) {
    // Valida unicidade
    const exists = await this.prisma.clinicSpecialty.findFirst({
      where: {
        clinicId: dto.clinicId,
        specialtyId: dto.specialtyId,
      },
    });
    if (exists)
      throw new BadRequestException(
        'Especialidade já cadastrada para esta clínica.',
      );

    return this.prisma.clinicSpecialty.create({ data: dto });
  }

  async findAll() {
    return this.prisma.clinicSpecialty.findMany({
      include: {
        clinic: true,
        specialty: true,
      },
    });
  }

  async findByClinic(clinicId: string) {
    return this.prisma.clinicSpecialty.findMany({
      where: { clinicId },
      include: { specialty: true },
    });
  }

  async remove(id: string) {
    const found = await this.prisma.clinicSpecialty.findUnique({
      where: { id },
    });
    if (!found) throw new NotFoundException('Especialidade não encontrada.');
    await this.prisma.clinicSpecialty.delete({ where: { id } });
    return { success: true };
  }
}
