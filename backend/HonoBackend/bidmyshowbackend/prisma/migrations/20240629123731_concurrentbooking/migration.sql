/*
  Warnings:

  - A unique constraint covering the columns `[booking_id,user_id]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expirestAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "expirestAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_booking_id_user_id_key" ON "Booking"("booking_id", "user_id");
