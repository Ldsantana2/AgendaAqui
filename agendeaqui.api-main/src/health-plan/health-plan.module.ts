import { Module } from '@nestjs/common';
import { HealthPlanService } from './health-plan.service';
import { HealthPlanController } from './health-plan.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [HealthPlanController],
  providers: [HealthPlanService, PrismaService],
})
export class HealthPlanModule {}
