/*
  Warnings:

  - You are about to drop the column `seats` on the `Show` table. All the data in the column will be lost.
  - Added the required column `total_seats` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Show" DROP COLUMN "seats",
ADD COLUMN     "booked_seats" INTEGER DEFAULT 0,
ADD COLUMN     "total_seats" INTEGER NOT NULL;
