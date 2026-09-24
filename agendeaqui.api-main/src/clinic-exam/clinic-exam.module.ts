import { Module } from '@nestjs/common';
import { ClinicExamService } from './clinic-exam.service';
import { ClinicExamController } from './clinic-exam.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ClinicExamController],
  providers: [ClinicExamService, PrismaService],
})
export class ClinicExamModule {}
