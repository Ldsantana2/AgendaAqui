import { Module } from '@nestjs/common';
import { ClinicHealthOperatorService } from './clinic-health-operator.service';
import { ClinicHealthOperatorController } from './clinic-health-operator.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ClinicHealthOperatorController],
  providers: [ClinicHealthOperatorService, PrismaService],
})
export class ClinicHealthOperatorModule {}
