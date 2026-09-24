import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHealthOperatorDto } from './dto/create-health-operator.dto';
import { UpdateHealthOperatorDto } from './dto/update-health-operator.dto';

@Injectable()
export class HealthOperatorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createHealthOperatorDto: CreateHealthOperatorDto) {
    return this.prisma.healthOperator.create({
      data: createHealthOperatorDto,
    });
  }

  async findAll() {
    return this.prisma.healthOperator.findMany({
      orderBy: {
        operatorCompanyName: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const operator = await this.prisma.healthOperator.findUnique({
      where: { id },
    });
    if (!operator) {
      throw new NotFoundException('Operadora não encontrada');
    }
    return operator;
  }

  async findByName(name: string) {
    const operator = await this.prisma.healthOperator.findFirst({
      where: {
        operatorCompanyName: name,
      },
    });

    if (!operator) {
      throw new NotFoundException(
        'Operadora com esse nome não foi encontrada.',
      );
    }

    return operator;
  }

  async update(id: string, updateHealthOperatorDto: UpdateHealthOperatorDto) {
    return this.prisma.healthOperator.update({
      where: { id },
      data: updateHealthOperatorDto,
    });
  }

  async remove(id: string) {
    return this.prisma.healthOperator.delete({ where: { id } });
  }
}
