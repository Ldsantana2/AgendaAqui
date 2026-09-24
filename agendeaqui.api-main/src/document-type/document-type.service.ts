import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';

@Injectable()
export class DocumentTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDocumentTypeDto) {
    return this.prisma.documentType.create({ data: dto });
  }

  async findAll() {
    return this.prisma.documentType.findMany();
  }

  async findOne(id: string) {
    const docType = await this.prisma.documentType.findUnique({
      where: { id },
    });
    if (!docType) throw new NotFoundException('Type not found');
    return docType;
  }
}
