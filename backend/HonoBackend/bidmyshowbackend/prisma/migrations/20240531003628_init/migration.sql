/*
  Warnings:

  - Added the required column `booking_id` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "booking_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
