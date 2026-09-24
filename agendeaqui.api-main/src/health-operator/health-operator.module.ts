import { Module } from '@nestjs/common';
import { HealthOperatorService } from './health-operator.service';
import { HealthOperatorController } from './health-operator.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [HealthOperatorController],
  providers: [HealthOperatorService, PrismaService],
})
export class HealthOperatorModule {}
