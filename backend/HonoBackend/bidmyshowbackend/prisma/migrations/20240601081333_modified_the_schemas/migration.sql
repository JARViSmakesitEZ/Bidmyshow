/*
  Warnings:

  - You are about to drop the column `amount` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `bidder_id` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `bidding` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `current_max_bid` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `max_bid_user_id` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_bidder_id_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "amount",
DROP COLUMN "bidder_id",
ADD COLUMN     "bidding" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "current_max_bid" INTEGER DEFAULT 0,
ADD COLUMN     "max_bid_user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bidding",
DROP COLUMN "current_max_bid";

-- CreateIndex
CREATE INDEX "Bid_booking_id_idx" ON "Bid"("booking_id");

-- CreateIndex
CREATE INDEX "Bid_max_bid_user_id_idx" ON "Bid"("max_bid_user_id");

-- CreateIndex
CREATE INDEX "Booking_show_id_idx" ON "Booking"("show_id");

-- CreateIndex
CREATE INDEX "Booking_user_id_idx" ON "Booking"("user_id");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_max_bid_user_id_fkey" FOREIGN KEY ("max_bid_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
