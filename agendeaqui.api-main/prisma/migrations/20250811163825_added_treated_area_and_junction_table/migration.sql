-- CreateTable
CREATE TABLE "ClinicTreatedArea" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "treatedAreaId" TEXT NOT NULL,

    CONSTRAINT "ClinicTreatedArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TreatedArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "TreatedArea_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClinicTreatedArea_clinicId_idx" ON "ClinicTreatedArea"("clinicId");

-- CreateIndex
CREATE INDEX "ClinicTreatedArea_treatedAreaId_idx" ON "ClinicTreatedArea"("treatedAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "ClinicTreatedArea_clinicId_treatedAreaId_key" ON "ClinicTreatedArea"("clinicId", "treatedAreaId");

-- CreateIndex
CREATE UNIQUE INDEX "TreatedArea_name_key" ON "TreatedArea"("name");

-- AddForeignKey
ALTER TABLE "ClinicTreatedArea" ADD CONSTRAINT "ClinicTreatedArea_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicTreatedArea" ADD CONSTRAINT "ClinicTreatedArea_treatedAreaId_fkey" FOREIGN KEY ("treatedAreaId") REFERENCES "TreatedArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
