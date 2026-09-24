import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import { CreateMedicalDocumentDto } from './dto/create-medical-document.dto';

@Injectable()
export class MedicalDocumentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  async createWithUpload(
    dto: CreateMedicalDocumentDto,
    file: Express.Multer.File,
  ) {
    // Upload para Azure, retorna { url, blobName }
    const { url, blobName } = await this.azureBlobService.uploadFile(file);

    return this.prisma.medicalDocument.create({
      data: {
        url,
        blobName,
        fileName: file.originalname,
        patientId: dto.patientId,
        clinicId: dto.clinicId,
        typeId: dto.typeId,
      },
      include: { type: true },
    });
  }

  async findAll(patientId?: string, clinicId?: string) {
    return this.prisma.medicalDocument.findMany({
      where: {
        patientId: patientId || undefined,
        clinicId: clinicId || undefined,
      },
      include: { type: true },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const doc = await this.prisma.medicalDocument.findUnique({
      where: { id },
      include: { type: true },
    });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async remove(id: string) {
    const doc = await this.prisma.medicalDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    await this.azureBlobService.deleteFileByUrl(doc.url);
    return this.prisma.medicalDocument.delete({ where: { id } });
  }

  async getDownloadUrl(id: string, expires = 15) {
    const doc = await this.prisma.medicalDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return this.azureBlobService.generateSasUrl(doc.url, expires);
  }

  async generateDocumentSasUrl(id: string): Promise<string> {
    const doc = await this.prisma.medicalDocument.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    return this.azureBlobService.generateSasUrl(doc.blobName, 15);
  }
}
