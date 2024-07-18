-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('own', 'sold', 'bidding');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('pending', 'accepted', 'captured');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "balance" INTEGER NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theatre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Theatre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Show" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "theatre_id" INTEGER NOT NULL,
    "total_seats" INTEGER NOT NULL,
    "ticket_price" INTEGER NOT NULL,
    "booked_seats" INTEGER DEFAULT 0,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShowInterests" (
    "showId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,

    CONSTRAINT "ShowInterests_pkey" PRIMARY KEY ("showId","interestId")
);

-- CreateTable
CREATE TABLE "Booking" (
    "booking_id" SERIAL NOT NULL,
    "show_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bidding" BOOLEAN DEFAULT false,
    "amount" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'own',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_id","user_id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "booking_user_id" INTEGER NOT NULL,
    "bidder_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInterests" (
    "userId" INTEGER NOT NULL,
    "interestId" INTEGER NOT NULL,

    CONSTRAINT "UserInterests_pkey" PRIMARY KEY ("userId","interestId")
);

-- CreateTable
CREATE TABLE "Interest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Booking_show_id_idx" ON "Booking"("show_id");

-- CreateIndex
CREATE INDEX "Booking_user_id_idx" ON "Booking"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_booking_id_user_id_key" ON "Booking"("booking_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_name_key" ON "Interest"("name");

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_theatre_id_fkey" FOREIGN KEY ("theatre_id") REFERENCES "Theatre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowInterests" ADD CONSTRAINT "ShowInterests_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShowInterests" ADD CONSTRAINT "ShowInterests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_booking_id_booking_user_id_fkey" FOREIGN KEY ("booking_id", "booking_user_id") REFERENCES "Booking"("booking_id", "user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_bidder_id_fkey" FOREIGN KEY ("bidder_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterests" ADD CONSTRAINT "UserInterests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInterests" ADD CONSTRAINT "UserInterests_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
