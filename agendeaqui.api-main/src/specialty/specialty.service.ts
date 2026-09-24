import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { AssignSpecialtyDto } from './dto/assign-specialty.dto';
import { UpdateDoctorSpecialtiesDto } from './dto/update-doctor-specialties.dto';

@Injectable()
export class SpecialtyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSpecialtyDto) {
    return this.prisma.specialty.create({
      data: { name: dto.name },
    });
  }

  async findAll() {
    return this.prisma.specialty.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const specialty = await this.prisma.specialty.findUnique({ where: { id } });
    if (!specialty) {
      throw new NotFoundException('Especialidade não encontrada.');
    }
    return specialty;
  }

  async update(id: string, dto: CreateSpecialtyDto) {
    return this.prisma.specialty.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async remove(id: string) {
    await this.prisma.specialty.delete({ where: { id } });
    return { message: 'Especialidade removida com sucesso!' };
  }

  async assignSpecialtyToDoctor(dto: AssignSpecialtyDto) {
    const doctorExists = await this.prisma.doctor.findUnique({
      where: { id: dto.doctorId },
    });

    const specialtyExists = await this.prisma.specialty.findUnique({
      where: { id: dto.specialtyId },
    });

    if (!doctorExists || !specialtyExists) {
      throw new BadRequestException('Médico ou especialidade não encontrados.');
    }

    return this.prisma.doctorSpecialty.create({
      data: {
        doctorId: dto.doctorId,
        specialtyId: dto.specialtyId,
        isPrimary: false,
      },
    });
  }

  async setPrimarySpecialty(dto: AssignSpecialtyDto) {
    const { doctorId, specialtyId } = dto;

    await this.prisma.doctorSpecialty.updateMany({
      where: { doctorId },
      data: { isPrimary: false },
    });

    await this.prisma.doctorSpecialty.updateMany({
      where: { doctorId, specialtyId },
      data: { isPrimary: true },
    });

    return this.findOne(specialtyId);
  }

  async updateDoctorSpecialties(
    doctorId: string,
    dto: UpdateDoctorSpecialtiesDto,
  ) {
    const { specialties } = dto;

    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new NotFoundException('Médico não encontrado.');
    }

    const primaryCount = specialties.filter((s) => s.isPrimary).length;
    if (primaryCount > 1) {
      throw new BadRequestException(
        'Apenas uma especialidade pode ser primária.',
      );
    }

    await this.prisma.doctorSpecialty.deleteMany({ where: { doctorId } });

    const data = specialties.map((s) => ({
      doctorId,
      specialtyId: s.id,
      isPrimary: s.isPrimary,
    }));

    try {
      await Promise.all(
        data.map((item) =>
          this.prisma.doctorSpecialty.create({
            data: item,
          }),
        ),
      );
    } catch (error) {
      console.error('Erro ao criar especialidades do médico:', error);

      if (
        error.code === 'P2002' &&
        error.meta?.target?.includes('doctorId_isPrimary')
      ) {
        throw new BadRequestException('Já existe uma especialidade primária.');
      }

      throw new BadRequestException('Erro ao atualizar especialidades.');
    }

    const doctorWithSpecialties = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
      include: {
        specialtyLinks: {
          include: { specialty: true },
        },
      },
    });

    if (!doctorWithSpecialties) {
      throw new NotFoundException(
        'Erro ao buscar médico após atualizar especialidades.',
      );
    }

    const specialtiesWithPrimary = doctorWithSpecialties.specialtyLinks.map(
      (link) => ({
        ...link.specialty,
        isPrimary: link.isPrimary,
      }),
    );

    return {
      ...doctorWithSpecialties,
      specialties: specialtiesWithPrimary,
    };
  }
}
