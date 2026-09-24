/*
  Warnings:

  - A unique constraint covering the columns `[doctorId,specialtyId]` on the table `DoctorSpecialty` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DoctorSpecialty_doctorId_specialtyId_key" ON "DoctorSpecialty"("doctorId", "specialtyId");
