-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "ConfirmationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT', 'CLINIC', 'RECEPTIONIST');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('ONLINE', 'PRESENCIAL');

-- CreateEnum
CREATE TYPE "BlogPostStatus" AS ENUM ('SKETCH', 'PUBLISHED', 'INACTIVE');

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "confirmationStatus" "ConfirmationStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3) NOT NULL,
    "doctorId" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "clinicLocationId" TEXT,
    "clinicServiceId" TEXT,
    "doctorServiceId" TEXT,
    "healthPlanId" TEXT,
    "clinicId" TEXT,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clinic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "about" TEXT,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicExam" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "examId" TEXT NOT NULL,

    CONSTRAINT "ClinicExam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicHealthOperator" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "healthOperatorId" TEXT NOT NULL,

    CONSTRAINT "ClinicHealthOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicLocation" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "complement" TEXT,
    "location" geometry,
    "number" TEXT NOT NULL,

    CONSTRAINT "ClinicLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicService" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "customName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "serviceCategoryId" TEXT NOT NULL,

    CONSTRAINT "ClinicService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicSpecialty" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,

    CONSTRAINT "ClinicSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "ClinicUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "crm" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "aboutMe" TEXT,
    "gender" TEXT,
    "birthDay" TIMESTAMP(3),
    "cnpj" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorHealthOperator" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "healthOperatorId" TEXT NOT NULL,

    CONSTRAINT "DoctorHealthOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorService" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "customName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "serviceCategoryId" TEXT NOT NULL,

    CONSTRAINT "DoctorService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorSpecialty" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DoctorSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorVerificationCode" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorVerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "examTypeId" TEXT,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ExamType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthOperator" (
    "id" TEXT NOT NULL,
    "operatorCompanyName" TEXT NOT NULL,
    "operatorRegistry" TEXT NOT NULL,

    CONSTRAINT "HealthOperator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthPlan" (
    "id" TEXT NOT NULL,
    "healthOperatorId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "planName" TEXT NOT NULL,
    "accommodation" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HealthPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthPlanType" (
    "id" TEXT NOT NULL,
    "healthOperatorId" TEXT NOT NULL,
    "planRegistry" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "accommodation" TEXT NOT NULL,

    CONSTRAINT "HealthPlanType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicalHistory" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "pastDiseases" TEXT,
    "chronicDiseases" TEXT,
    "familySeriousDiseases" TEXT,
    "allergies" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medications" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "currentMedications" TEXT[],
    "pastMedications" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetCode" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "birthDay" TIMESTAMP(3),
    "gender" TEXT,
    "cpf" TEXT NOT NULL,
    "cep" TEXT,
    "city" TEXT,
    "complement" TEXT,
    "number" TEXT,
    "state" TEXT,
    "street" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "patient_id" TEXT NOT NULL,
    "clinic_id" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT,
    "type" "ScheduleType" NOT NULL,
    "clinicId" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "endTime" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "clinicLocationId" TEXT,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "loginCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ServiceCategoryToSpecialty" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ServiceCategoryToSpecialty_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_userId_key" ON "Clinic"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicExam_clinicId_examId_key" ON "ClinicExam"("clinicId", "examId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicHealthOperator_clinicId_healthOperatorId_key" ON "ClinicHealthOperator"("clinicId", "healthOperatorId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicService_clinicId_serviceCategoryId_customName_key" ON "ClinicService"("clinicId", "serviceCategoryId", "customName");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicSpecialty_clinicId_specialtyId_key" ON "ClinicSpecialty"("clinicId", "specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_userId_key" ON "Doctor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorHealthOperator_doctorId_healthOperatorId_key" ON "DoctorHealthOperator"("doctorId", "healthOperatorId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorService_doctorId_serviceCategoryId_customName_key" ON "DoctorService"("doctorId", "serviceCategoryId", "customName");

-- CreateIndex
CREATE UNIQUE INDEX "unique_primary_specialty" ON "DoctorSpecialty"("doctorId", "isPrimary");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorVerificationCode_doctorId_key" ON "DoctorVerificationCode"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorVerificationCode_code_key" ON "DoctorVerificationCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_name_key" ON "Exam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExamType_name_key" ON "ExamType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalHistory_patientId_key" ON "MedicalHistory"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Medications_patientId_key" ON "Medications"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetCode_userId_key" ON "PasswordResetCode"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetCode_code_key" ON "PasswordResetCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_key" ON "Patient"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_cpf_key" ON "Patient"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_refreshToken_key" ON "RefreshToken"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "_ServiceCategoryToSpecialty_B_index" ON "_ServiceCategoryToSpecialty"("B");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicLocationId_fkey" FOREIGN KEY ("clinicLocationId") REFERENCES "ClinicLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicServiceId_fkey" FOREIGN KEY ("clinicServiceId") REFERENCES "ClinicService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_doctorServiceId_fkey" FOREIGN KEY ("doctorServiceId") REFERENCES "DoctorService"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_healthPlanId_fkey" FOREIGN KEY ("healthPlanId") REFERENCES "HealthPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clinic" ADD CONSTRAINT "Clinic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicExam" ADD CONSTRAINT "ClinicExam_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicExam" ADD CONSTRAINT "ClinicExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicHealthOperator" ADD CONSTRAINT "ClinicHealthOperator_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicHealthOperator" ADD CONSTRAINT "ClinicHealthOperator_healthOperatorId_fkey" FOREIGN KEY ("healthOperatorId") REFERENCES "HealthOperator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicLocation" ADD CONSTRAINT "ClinicLocation_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicService" ADD CONSTRAINT "ClinicService_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicService" ADD CONSTRAINT "ClinicService_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSpecialty" ADD CONSTRAINT "ClinicSpecialty_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicSpecialty" ADD CONSTRAINT "ClinicSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicUser" ADD CONSTRAINT "ClinicUser_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicUser" ADD CONSTRAINT "ClinicUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHealthOperator" ADD CONSTRAINT "DoctorHealthOperator_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHealthOperator" ADD CONSTRAINT "DoctorHealthOperator_healthOperatorId_fkey" FOREIGN KEY ("healthOperatorId") REFERENCES "HealthOperator"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorService" ADD CONSTRAINT "DoctorService_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorService" ADD CONSTRAINT "DoctorService_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorVerificationCode" ADD CONSTRAINT "DoctorVerificationCode_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorVerificationCode" ADD CONSTRAINT "DoctorVerificationCode_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_examTypeId_fkey" FOREIGN KEY ("examTypeId") REFERENCES "ExamType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthPlan" ADD CONSTRAINT "HealthPlan_healthOperatorId_fkey" FOREIGN KEY ("healthOperatorId") REFERENCES "HealthOperator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthPlan" ADD CONSTRAINT "HealthPlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthPlanType" ADD CONSTRAINT "HealthPlanType_healthOperatorId_fkey" FOREIGN KEY ("healthOperatorId") REFERENCES "HealthOperator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalHistory" ADD CONSTRAINT "MedicalHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medications" ADD CONSTRAINT "Medications_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetCode" ADD CONSTRAINT "PasswordResetCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Patient" ADD CONSTRAINT "Patient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "review_clinic_fk" FOREIGN KEY ("clinic_id") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "review_patient_fk" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_clinicLocationId_fkey" FOREIGN KEY ("clinicLocationId") REFERENCES "ClinicLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceCategoryToSpecialty" ADD CONSTRAINT "_ServiceCategoryToSpecialty_A_fkey" FOREIGN KEY ("A") REFERENCES "ServiceCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ServiceCategoryToSpecialty" ADD CONSTRAINT "_ServiceCategoryToSpecialty_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialty"("id") ON DELETE CASCADE ON UPDATE CASCADE;
