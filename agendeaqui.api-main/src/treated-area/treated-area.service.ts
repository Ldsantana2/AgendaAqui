import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTreatedAreaDto } from './dto/create-treated-area.dto';

@Injectable()
export class TreatedAreaService {
  constructor(private prisma: PrismaService) {}

  async create(createTreatedAreaDto: CreateTreatedAreaDto) {
    return this.prisma.treatedArea.create({
      data: {
        name: createTreatedAreaDto.name,
      },
    });
  }

  async findAll() {
    const result = await this.prisma.treatedArea.findMany();

    return result;
  }

  async findOne(id: string) {
    return this.prisma.treatedArea.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.treatedArea.delete({
      where: { id },
    });
  }
}
