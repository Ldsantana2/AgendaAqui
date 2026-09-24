import { Module } from '@nestjs/common';
import { ClinicServiceService } from './clinic-service.service';
import { ClinicServiceController } from './clinic-service.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClinicServiceController],
  providers: [ClinicServiceService, PrismaService],
})
export class ClinicServiceModule {}
