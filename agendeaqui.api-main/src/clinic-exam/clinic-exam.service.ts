import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClinicExamDto } from './dto/create-clinic-exam.dto';
import { UpdateClinicExamDto } from './dto/update-clinic-exam.dto';

@Injectable()
export class ClinicExamService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClinicExamDto: CreateClinicExamDto) {
    return this.prisma.clinicExam.create({
      data: createClinicExamDto,
    });
  }

  async findByClinicAndExam(clinicId: string, examId: string) {
    return this.prisma.clinicExam.findFirst({
      where: {
        clinicId,
        examId,
      },
    });
  }

  async findAll() {
    return this.prisma.clinicExam.findMany({
      include: {
        clinic: true,
        exam: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.clinicExam.findUnique({
      where: { id },
      include: {
        clinic: true,
        exam: true,
      },
    });
  }

  async update(id: string, updateClinicExamDto: UpdateClinicExamDto) {
    return this.prisma.clinicExam.update({
      where: { id },
      data: updateClinicExamDto,
    });
  }

  async remove(id: string) {
    return this.prisma.clinicExam.delete({
      where: { id },
    });
  }

  async findByClinic(clinicId: string) {
    return this.prisma.clinicExam.findMany({
      where: { clinicId },
      include: {
        exam: true, // Inclui os detalhes do exame
        clinic: true, // Opcional: pode remover se não quiser detalhes da clínica
      },
    });
  }

  async findClinicsByExamId(examId: string) {
    return this.prisma.clinicExam
      .findMany({
        where: {
          examId: examId,
        },
        include: {
          clinic: true, // Inclui os dados da clínica associada
        },
      })
      .then((clinicExams) =>
        clinicExams.map((clinicExam) => clinicExam.clinic),
      );
  }
  async findClinicsByExamIds(examIds: string[]) {
    if (!examIds.length) return [];

    const clinicExams = await this.prisma.clinicExam.findMany({
      where: {
        examId: { in: examIds },
      },
      include: {
        clinic: true,
      },
    });

    const clinicMap = new Map<string, { count: number; clinic: any }>();

    for (const ce of clinicExams) {
      const clinicId = ce.clinic.id;
      const entry = clinicMap.get(clinicId) || { count: 0, clinic: ce.clinic };
      clinicMap.set(clinicId, { ...entry, count: entry.count + 1 });
    }

    return Array.from(clinicMap.values())
      .filter((entry) => entry.count === examIds.length)
      .map((entry) => entry.clinic);
  }
}
