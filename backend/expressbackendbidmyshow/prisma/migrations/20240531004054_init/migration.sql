/*
  Warnings:

  - You are about to drop the column `show_id` on the `Bid` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_show_id_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "show_id";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "bidding" BOOLEAN NOT NULL DEFAULT false;
