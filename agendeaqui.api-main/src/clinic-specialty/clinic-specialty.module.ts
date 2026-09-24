import { Module } from '@nestjs/common';
import { ClinicSpecialtyService } from './clinic-specialty.service';
import { ClinicSpecialtyController } from './clinic-specialty.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicSpecialtyController],
  providers: [ClinicSpecialtyService, PrismaService],
})
export class ClinicSpecialtyModule {}
