/*
  Warnings:

  - You are about to drop the column `Description` on the `Show` table. All the data in the column will be lost.
  - Added the required column `description` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Show" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ShowInterests" (
    "showId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,

    CONSTRAINT "ShowInterests_pkey" PRIMARY KEY ("showId","interestId")
);

-- AddForeignKey
ALTER TABLE "ShowInterests" ADD CONSTRAINT "ShowInterests_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowInterests" ADD CONSTRAINT "ShowInterests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
