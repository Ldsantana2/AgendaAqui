import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule, EmailModule, ConfigModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, PrismaService],
})
export class AppointmentModule {}
