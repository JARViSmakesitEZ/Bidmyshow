/*
  Warnings:

  - You are about to drop the column `amount` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Bid` table. All the data in the column will be lost.
  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `booking_user_id` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booking_id` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_booking_id_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "amount",
DROP COLUMN "status",
ADD COLUMN     "booking_user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
DROP COLUMN "id",
ADD COLUMN     "booking_id" INTEGER NOT NULL,
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_id", "user_id");

-- CreateIndex
CREATE INDEX "Bid_booking_id_booking_user_id_idx" ON "Bid"("booking_id", "booking_user_id");

-- CreateIndex
CREATE INDEX "Bid_bidder_id_idx" ON "Bid"("bidder_id");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_booking_id_booking_user_id_fkey" FOREIGN KEY ("booking_id", "booking_user_id") REFERENCES "Booking"("booking_id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
