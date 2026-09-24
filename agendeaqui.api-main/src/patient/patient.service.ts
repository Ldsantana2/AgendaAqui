import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { AzureBlobService } from 'src/azure-blob/azure-blob.service';

@Injectable()
export class PatientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const { userId, cpf, phone, name, surname, gender, birthDay } =
      createPatientDto;

    const existingPatient = await this.prisma.patient.findUnique({
      where: { userId },
    });

    if (existingPatient) {
      throw new BadRequestException('Paciente já cadastrado.');
    }

    const existingCpf = await this.prisma.patient.findFirst({
      where: { cpf },
    });

    if (existingCpf) {
      throw new BadRequestException('CPF já está em uso.');
    }

    return this.prisma.patient.create({
      data: {
        userId,
        cpf,
        phone,
        name,
        surname,
        gender,
        birthDay,
      },
    });
  }

  async findAll() {
    return this.prisma.patient.findMany({
      include: {
        user: true,
        healthPlans: {
          include: {
            healthOperator: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        user: true,
        healthPlans: {
          include: {
            healthOperator: true,
          },
        },
        MedicalHistory: true,
        Medications: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const { userId, cpf, phone, name, surname, gender, birthDay } =
      updatePatientDto;

    if (cpf) {
      const existingCpf = await this.prisma.patient.findFirst({
        where: {
          cpf,
          id: { not: id },
        },
      });

      if (existingCpf) {
        throw new BadRequestException('CPF já está em uso.');
      }
    }

    return this.prisma.patient.update({
      where: { id },
      data: {
        userId,
        cpf,
        phone,
        name,
        surname,
        gender,
        birthDay,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.patient.delete({
      where: { id },
    });
  }

  async setProfileImage(id: string, file: Express.Multer.File) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');

    // Remove previous image if exists
    if (patient.profileImageUrl) {
      await this.azureBlobService.deleteFileByUrl(patient.profileImageUrl);
    }

    // Upload new image
    const { url } = await this.azureBlobService.uploadFile(file);

    // Save URL in DB
    await this.prisma.patient.update({
      where: { id },
      data: { profileImageUrl: url },
    });

    return { url };
  }

  async deleteProfileImage(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient || !patient.profileImageUrl) {
      throw new NotFoundException('Patient or profile image not found');
    }

    await this.azureBlobService.deleteFileByUrl(patient.profileImageUrl);

    await this.prisma.patient.update({
      where: { id },
      data: { profileImageUrl: null },
    });

    return { message: 'Profile image deleted' };
  }
}
