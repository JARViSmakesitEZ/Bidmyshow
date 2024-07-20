/*
  Warnings:

  - You are about to drop the column `user_id` on the `Bid` table. All the data in the column will be lost.
  - Added the required column `bidder_id` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_user_id_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "user_id",
ADD COLUMN     "bidder_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
