import { Injectable } from '@nestjs/common';
import { CreateExamTypeDto } from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { ExamType } from '@prisma/client'; // Prisma model
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamTypeService {
  constructor(private prisma: PrismaService) {}

  async create(createExamTypeDto: CreateExamTypeDto): Promise<ExamType> {
    return this.prisma.examType.create({
      data: createExamTypeDto,
    });
  }

  async findAll(): Promise<ExamType[]> {
    return this.prisma.examType.findMany();
  }

  async findOne(id: string): Promise<ExamType | null> {
    return this.prisma.examType.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateExamTypeDto: UpdateExamTypeDto): Promise<ExamType> {
    return this.prisma.examType.update({
      where: { id },
      data: updateExamTypeDto,
    });
  }

  async remove(id: string): Promise<ExamType> {
    return this.prisma.examType.delete({
      where: { id },
    });
  }
}
