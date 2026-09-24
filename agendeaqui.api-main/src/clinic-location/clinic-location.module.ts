import { Module } from '@nestjs/common';
import { ClinicLocationService } from './clinic-location.service';
import { ClinicLocationController } from './clinic-location.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicLocationController],
  providers: [ClinicLocationService, PrismaService],
  exports: [ClinicLocationService],
})
export class ClinicLocationModule {}
