/*
  Warnings:

  - You are about to drop the column `bidding` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `max_bid_user_id` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `currentMaxBid` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_max_bid_user_id_fkey";

-- DropIndex
DROP INDEX "Bid_booking_id_idx";

-- DropIndex
DROP INDEX "Bid_max_bid_user_id_idx";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "bidding",
DROP COLUMN "max_bid_user_id",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "currentMaxBid",
ADD COLUMN     "bidding" BOOLEAN DEFAULT false;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
