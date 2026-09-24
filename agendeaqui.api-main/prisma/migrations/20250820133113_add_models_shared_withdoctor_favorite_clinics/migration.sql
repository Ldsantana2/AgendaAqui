-- CreateTable
CREATE TABLE "FavoriteClinics" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,

    CONSTRAINT "FavoriteClinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedWithDoctor" (
    "id" TEXT NOT NULL,
    "medicalDocumentId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedWithDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedWithDoctor_medicalDocumentId_doctorId_key" ON "SharedWithDoctor"("medicalDocumentId", "doctorId");

-- AddForeignKey
ALTER TABLE "FavoriteClinics" ADD CONSTRAINT "FavoriteClinics_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteClinics" ADD CONSTRAINT "FavoriteClinics_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedWithDoctor" ADD CONSTRAINT "SharedWithDoctor_medicalDocumentId_fkey" FOREIGN KEY ("medicalDocumentId") REFERENCES "MedicalDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedWithDoctor" ADD CONSTRAINT "SharedWithDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
