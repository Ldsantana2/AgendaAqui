import { Injectable } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from '@prisma/client'; // Prisma model
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    return this.prisma.exam.create({
      data: createExamDto,
      include: {
        examType: true,
      },
    });
  }

  async findAll(): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      include: {
        examType: true,
      },
    });
  }

  async findOne(id: string): Promise<Exam | null> {
    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        examType: true,
      },
    });
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    return this.prisma.exam.update({
      where: { id },
      data: updateExamDto,
      include: {
        examType: true,
      },
    });
  }

  async remove(id: string): Promise<Exam> {
    return this.prisma.exam.delete({
      where: { id },
      include: {
        examType: true,
      },
    });
  }

  async findByExamType(examTypeId: string): Promise<Exam[]> {
    return this.prisma.exam.findMany({
      where: { examTypeId },
    });
  }
}
