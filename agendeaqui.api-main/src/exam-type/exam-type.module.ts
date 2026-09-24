import { Module } from '@nestjs/common';
import { ExamTypeService } from './exam-type.service';
import { ExamTypeController } from './exam-type.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ExamTypeController],
  providers: [ExamTypeService, PrismaService],
})
export class ExamTypeModule {}