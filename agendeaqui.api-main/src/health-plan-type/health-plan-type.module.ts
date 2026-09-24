import { Module } from '@nestjs/common';
import { HealthPlanTypeService } from './health-plan-type.service';
import { HealthPlanTypeController } from './health-plan-type.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HealthPlanTypeController],
  providers: [HealthPlanTypeService, PrismaService],
})
export class HealthPlanTypeModule {}
