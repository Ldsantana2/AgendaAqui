import { Module } from '@nestjs/common';
import { MedicalDocumentService } from './medical-document.service';
import { MedicalDocumentController } from './medical-document.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AzureBlobModule } from 'src/azure-blob/azure-blob.module';

@Module({
  imports: [PrismaModule, AzureBlobModule],
  controllers: [MedicalDocumentController],
  providers: [MedicalDocumentService, PrismaService],
})
export class MedicalDocumentModule {}
