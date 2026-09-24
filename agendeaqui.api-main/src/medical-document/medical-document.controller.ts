import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Query,
  Delete,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MedicalDocumentService } from './medical-document.service';
import { CreateMedicalDocumentDto } from './dto/create-medical-document.dto';
import { AzureBlobService } from '../azure-blob/azure-blob.service';

@Controller('medical-documents')
export class MedicalDocumentController {
  constructor(
    private readonly medicalDocumentService: MedicalDocumentService,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateMedicalDocumentDto,
  ) {
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }
    return this.medicalDocumentService.createWithUpload(body, file);
  }

  @Get()
  async findAll(
    @Query('patientId') patientId?: string,
    @Query('clinicId') clinicId?: string,
  ) {
    return this.medicalDocumentService.findAll(patientId, clinicId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.medicalDocumentService.findOne(id);
  }

  @Get(':id/download-url')
  async getDownloadUrl(@Param('id') id: string) {
    // 1. Busca o documento
    const doc = await this.medicalDocumentService.findOne(id);
    if (!doc || !doc.url) throw new NotFoundException('Document not found');
    // 2. Extrai o nome do blob do URL
    const blobUrl = new URL(doc.url);
    const blobName = blobUrl.pathname.split('/').slice(2).join('/');
    // 3. Gera a SAS URL
    const sasUrl = await this.azureBlobService.generateSasUrl(blobName, 30); // 30 min de validade
    return { url: sasUrl };
  }

  @Get(':id/sas-url')
  async getSasUrl(@Param('id') id: string) {
    const sasUrl = await this.medicalDocumentService.generateDocumentSasUrl(id);
    return { url: sasUrl };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.medicalDocumentService.remove(id);
  }
}
