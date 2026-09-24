import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClinicServiceDto } from './dto/create-clinic-service.dto';
import { UpdateClinicServiceDto } from './dto/update-clinic-service.dto';

@Injectable()
export class ClinicServiceService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateClinicServiceDto) {
    // Checagem de unicidade
    const exists = await this.prisma.clinicService.findFirst({
      where: {
        clinicId: dto.clinicId,
        serviceCategoryId: dto.serviceCategoryId,
        customName: dto.customName,
      },
    });
    if (exists) {
      throw new BadRequestException(
        'Serviço já cadastrado para essa clínica, categoria e nome.',
      );
    }

    return this.prisma.clinicService.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.clinicService.findMany();
  }

  async findOne(id: string) {
    const found = await this.prisma.clinicService.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Serviço não encontrado.');
    return found;
  }

  async findByClinicId(clinicId: string) {
    return this.prisma.clinicService.findMany({
      where: { clinicId },
    });
  }

  async update(id: string, dto: UpdateClinicServiceDto) {
    const found = await this.prisma.clinicService.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Serviço não encontrado.');

    // Se houver alteração em clinicId, serviceCategoryId ou customName,
    // validar unicidade
    if (
      (dto.clinicId && dto.clinicId !== found.clinicId) ||
      (dto.serviceCategoryId &&
        dto.serviceCategoryId !== found.serviceCategoryId) ||
      (dto.customName && dto.customName !== found.customName)
    ) {
      const exists = await this.prisma.clinicService.findFirst({
        where: {
          clinicId: dto.clinicId ?? found.clinicId,
          serviceCategoryId: dto.serviceCategoryId ?? found.serviceCategoryId,
          customName: dto.customName ?? found.customName,
          NOT: { id }, // Ignorar o próprio registro
        },
      });
      if (exists) {
        throw new BadRequestException(
          'Serviço já cadastrado para essa clínica, categoria e nome.',
        );
      }
    }

    return this.prisma.clinicService.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const found = await this.prisma.clinicService.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Serviço não encontrado.');
    await this.prisma.clinicService.delete({ where: { id } });
    return { isSuccess: true, message: 'Serviço removido com sucesso.' };
  }
}
