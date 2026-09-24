import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AzureBlobModule } from 'src/azure-blob/azure-blob.module';

@Module({
  imports: [PrismaModule, AzureBlobModule],
  controllers: [PatientController],
  providers: [PatientService],
})
export class PatientModule {}
