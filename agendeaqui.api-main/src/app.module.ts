import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { HealthPlanModule } from './health-plan/health-plan.module';
import { HealthOperatorModule } from './health-operator/health-operator.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppointmentModule } from './appointment/appointment.module';
import { PrismaService } from './prisma/prisma.service';
import { SpecialtyModule } from './specialty/specialty.module';
import { ClinicModule } from './clinic/clinic.module';
import { ServiceCategoryModule } from './service/service-category.module';
import { ReviewsModule } from './review/review.module';
import { EmailModule } from './email/email.module';
import { HealthPlanTypeModule } from './health-plan-type/health-plan-type.module';
import { ClinicExamModule } from './clinic-exam/clinic-exam.module';
import { ExamModule } from './exam/exam.module';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';
import { ExamTypeModule } from './exam-type/exam-type.module';
import { ClinicServiceModule } from './clinic-service/clinic-service.module';
import { ClinicLocationModule } from './clinic-location/clinic-location.module';
import { MedicalHistoryModule } from './medical-history/medical-history.module';
import { MedicationsModule } from './medications/medications.module';
import { BlogModule } from './blog/blog.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logger/logging.interceptor';
import { LoggerService } from './logger/logger.service';
import { ClinicHealthOperatorModule } from './clinic-health-operator/clinic-health-operator.module';
import { MedicalDocumentModule } from './medical-document/medical-document.module';
import { DocumentTypeModule } from './document-type/document-type.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { TraceIdMiddleware } from './middleware/trace-id.middleware';
import { StatisticsModule } from './statistics/statistics.module';
import { ClinicSpecialtyModule } from './clinic-specialty/clinic-specialty.module';
import { TreatedAreaModule } from './treated-area/treated-area.module';
import { ClinicTreatedAreaModule } from './clinic-treated-area/clinic-treated-area.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PatientModule,
    DoctorModule,
    HealthPlanModule,
    HealthOperatorModule,
    ScheduleModule,
    AppointmentModule,
    SpecialtyModule,
    ClinicModule,
    ServiceCategoryModule,
    ReviewsModule,
    EmailModule,
    HealthPlanTypeModule,
    ClinicExamModule,
    ExamModule,
    ExamTypeModule,
    MessageModule,
    ClinicServiceModule,
    ClinicLocationModule,
    ClinicHealthOperatorModule,
    MedicalHistoryModule,
    MedicationsModule,
    BlogModule,
    MedicalDocumentModule,
    DocumentTypeModule,
    StatisticsModule,
    ClinicSpecialtyModule,
    TreatedAreaModule,
    ClinicTreatedAreaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useFactory: (logger: LoggerService) => new LoggingInterceptor(logger),
      inject: [LoggerService],
    },
  ],
  exports: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
