/*
  Warnings:

  - Added the required column `email` to the `Theatre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Theatre" ADD COLUMN     "email" TEXT NOT NULL;
