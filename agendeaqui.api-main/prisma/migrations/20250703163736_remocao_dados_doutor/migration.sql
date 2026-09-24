/*
  Warnings:

  - You are about to drop the column `doctorServiceId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `DoctorHealthOperator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DoctorService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_doctorServiceId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorHealthOperator" DROP CONSTRAINT "DoctorHealthOperator_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorHealthOperator" DROP CONSTRAINT "DoctorHealthOperator_healthOperatorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorService" DROP CONSTRAINT "DoctorService_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "DoctorService" DROP CONSTRAINT "DoctorService_serviceCategoryId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "doctorServiceId";

-- DropTable
DROP TABLE "DoctorHealthOperator";

-- DropTable
DROP TABLE "DoctorService";
