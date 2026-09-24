import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ServiceCategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceCategoryDto) {
    return this.prisma.serviceCategory.create({
      data: {
        name: createServiceDto.name,
      },
    });
  }

  async getAllServices() {
    return this.prisma.serviceCategory.findMany();
  }
}
