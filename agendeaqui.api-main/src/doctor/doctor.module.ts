import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AzureBlobModule } from 'src/azure-blob/azure-blob.module';

@Module({
  imports: [PrismaModule, AzureBlobModule],
  controllers: [DoctorController],
  providers: [DoctorService],
})
export class DoctorModule {}
