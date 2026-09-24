import { Module } from '@nestjs/common';
import { ClinicService } from './clinic.service';
import { ClinicController } from './clinic.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ClinicLocationService } from '../clinic-location/clinic-location.service';
import { AzureBlobModule } from 'src/azure-blob/azure-blob.module';

@Module({
  imports: [PrismaModule, AzureBlobModule],
  controllers: [ClinicController],
  providers: [ClinicService, ClinicLocationService],
  exports: [ClinicService, ClinicLocationService],
})
export class ClinicModule {}
