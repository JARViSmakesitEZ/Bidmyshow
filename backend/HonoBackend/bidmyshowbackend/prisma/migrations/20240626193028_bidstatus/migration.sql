/*
  Warnings:

  - You are about to drop the column `resolved` on the `Bid` table. All the data in the column will be lost.
  - Added the required column `status` to the `Bid` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('pending', 'accepted', 'captured');

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "resolved",
ADD COLUMN     "status" "BidStatus" NOT NULL;
