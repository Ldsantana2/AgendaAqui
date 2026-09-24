import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { PatientModule } from '../patient/patient.module';
import { DoctorService } from '../doctor/doctor.service';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientService } from '../patient/patient.service';
import { ClinicService } from '../clinic/clinic.service';
import { EmailModule } from '../email/email.module';
import { ClinicModule } from '../clinic/clinic.module';
import { AzureBlobModule } from 'src/azure-blob/azure-blob.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    PatientModule,
    DoctorModule,
    ClinicModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    EmailModule,
    AzureBlobModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PatientService,
    DoctorService,
  ],
})
export class AuthModule {}
