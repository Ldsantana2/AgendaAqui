import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

@Injectable()
export class MedicalHistoryService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateMedicalHistoryDto) {
    const patientExists = await this.prisma.patient.findUnique({
      where: { id: createDto.patientId },
    });
    if (!patientExists) {
      throw new NotFoundException('Paciente não encontrado');
    }
    return this.prisma.medicalHistory.create({
      data: {
        patientId: createDto.patientId,
        pastDiseases: createDto.pastDiseases ?? null,
        chronicDiseases: createDto.chronicDiseases ?? null,
        familySeriousDiseases: createDto.familySeriousDiseases ?? null,
        allergies: createDto.allergies ?? null,
      },
    });
  }

  async findAll() {
    return this.prisma.medicalHistory.findMany();
  }

  async findOne(id: string) {
    const history = await this.prisma.medicalHistory.findUnique({
      where: { id },
    });
    if (!history) {
      throw new NotFoundException('Histórico médico não encontrado');
    }
    return history;
  }

  async update(id: string, updateDto: UpdateMedicalHistoryDto) {
    const exists = await this.prisma.medicalHistory.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException('Histórico médico não encontrado');
    }
    return this.prisma.medicalHistory.update({
      where: { id },
      data: {
        pastDiseases: updateDto.pastDiseases,
        chronicDiseases: updateDto.chronicDiseases,
        familySeriousDiseases: updateDto.familySeriousDiseases,
        allergies: updateDto.allergies,
      },
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.medicalHistory.findUnique({
      where: { id },
    });
    if (!exists) {
      throw new NotFoundException('Histórico médico não encontrado');
    }
    return this.prisma.medicalHistory.delete({ where: { id } });
  }

  // Novos métodos para buscar, atualizar e deletar pelo patientId

  async findByPatientId(patientId: string) {
    const history = await this.prisma.medicalHistory.findUnique({
      where: { patientId },
    });
    if (!history) {
      throw new NotFoundException(
        'Histórico médico do paciente não encontrado',
      );
    }
    return history;
  }

  async updateByPatientId(
    patientId: string,
    updateDto: UpdateMedicalHistoryDto,
  ) {
    const exists = await this.prisma.medicalHistory.findUnique({
      where: { patientId },
    });
    if (!exists) {
      throw new NotFoundException(
        'Histórico médico do paciente não encontrado',
      );
    }
    return this.prisma.medicalHistory.update({
      where: { patientId },
      data: {
        pastDiseases: updateDto.pastDiseases,
        chronicDiseases: updateDto.chronicDiseases,
        familySeriousDiseases: updateDto.familySeriousDiseases,
        allergies: updateDto.allergies,
      },
    });
  }

  async removeByPatientId(patientId: string) {
    const exists = await this.prisma.medicalHistory.findUnique({
      where: { patientId },
    });
    if (!exists) {
      throw new NotFoundException(
        'Histórico médico do paciente não encontrado',
      );
    }
    return this.prisma.medicalHistory.delete({ where: { patientId } });
  }
}
