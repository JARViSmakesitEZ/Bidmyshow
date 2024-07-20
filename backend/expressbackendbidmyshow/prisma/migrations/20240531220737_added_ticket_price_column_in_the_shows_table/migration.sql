/*
  Warnings:

  - Added the required column `ticket_price` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "ticket_price" INTEGER NOT NULL;
