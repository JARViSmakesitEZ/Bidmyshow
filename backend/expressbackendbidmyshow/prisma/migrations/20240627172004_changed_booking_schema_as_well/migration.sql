/*
  Warnings:

  - Added the required column `amount` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('own', 'sold', 'bidding');

-- DropIndex
DROP INDEX "Bid_bidder_id_idx";

-- DropIndex
DROP INDEX "Bid_booking_id_booking_user_id_idx";

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "status" "BidStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'own';
