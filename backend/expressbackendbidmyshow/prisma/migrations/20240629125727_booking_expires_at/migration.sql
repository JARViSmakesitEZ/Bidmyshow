/*
  Warnings:

  - You are about to drop the column `expirestAt` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "expirestAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
