/*
  Warnings:

  - Added the required column `blobName` to the `MedicalDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalDocument" ADD COLUMN     "blobName" TEXT NOT NULL;
