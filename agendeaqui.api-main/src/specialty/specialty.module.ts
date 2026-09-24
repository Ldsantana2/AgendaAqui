import { Module } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialtyController],
  providers: [SpecialtyService],
})
export class SpecialtyModule {}
