import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Cria ou atualiza os medicamentos de um paciente
  async addManyToPatient(patientId: string, medications: CreateMedicationDto) {
    const existing = await this.prisma.medications.findUnique({
      where: { patientId },
    });

    if (existing) {
      return this.prisma.medications.update({
        where: { patientId },
        data: {
          currentMedications: medications.currentMedications,
          pastMedications: medications.pastMedications,
        },
      });
    }

    return this.prisma.medications.create({
      data: {
        patientId,
        currentMedications: medications.currentMedications,
        pastMedications: medications.pastMedications,
      },
    });
  }

  // Atualização parcial (PATCH)
  async updateMedications(
    patientId: string,
    updateDto: Partial<CreateMedicationDto>,
  ) {
    const existing = await this.prisma.medications.findUnique({
      where: { patientId },
    });

    if (!existing) {
      throw new NotFoundException(
        `Nenhum dado de medicamento encontrado para o paciente ${patientId}`,
      );
    }

    const dataToUpdate: Partial<{
      currentMedications: string[];
      pastMedications: string[];
    }> = {};

    if (updateDto.currentMedications !== undefined) {
      dataToUpdate.currentMedications = updateDto.currentMedications;
    }
    if (updateDto.pastMedications !== undefined) {
      dataToUpdate.pastMedications = updateDto.pastMedications;
    }

    return this.prisma.medications.update({
      where: { patientId },
      data: dataToUpdate,
    });
  }

  // Busca os medicamentos de um paciente
  async findByPatient(patientId: string) {
    const medications = await this.prisma.medications.findUnique({
      where: { patientId },
    });

    if (!medications) {
      throw new NotFoundException(
        `Nenhum dado de medicamento encontrado para o paciente ${patientId}`,
      );
    }

    return medications;
  }

  // Remove um medicamento específico de current ou past
  async removeFromPatient(
    patientId: string,
    medicationName: string,
    type: 'current' | 'past',
  ) {
    const medications = await this.prisma.medications.findUnique({
      where: { patientId },
    });

    if (!medications) {
      throw new NotFoundException(
        `Nenhum dado de medicamento encontrado para o paciente ${patientId}`,
      );
    }

    const updatedArray =
      type === 'current'
        ? medications.currentMedications.filter((m) => m !== medicationName)
        : medications.pastMedications.filter((m) => m !== medicationName);

    return this.prisma.medications.update({
      where: { patientId },
      data:
        type === 'current'
          ? { currentMedications: updatedArray }
          : { pastMedications: updatedArray },
    });
  }
}
