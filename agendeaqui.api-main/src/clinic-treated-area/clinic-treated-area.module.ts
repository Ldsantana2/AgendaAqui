import { Module } from '@nestjs/common';
import { ClinicTreatedAreaController } from './clinic-treated-area.controller';
import { ClinicTreatedAreaService } from './clinic-treated-area.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ClinicTreatedAreaController],
  providers: [ClinicTreatedAreaService, PrismaService],
  exports: [ClinicTreatedAreaService],
})
export class ClinicTreatedAreaModule {}
