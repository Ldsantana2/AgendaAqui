import { Module } from '@nestjs/common';
import { TreatedAreaController } from './treated-area.controller';
import { TreatedAreaService } from './treated-area.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TreatedAreaController],
  providers: [TreatedAreaService, PrismaService],
  exports: [TreatedAreaService],
})
export class TreatedAreaModule {}
