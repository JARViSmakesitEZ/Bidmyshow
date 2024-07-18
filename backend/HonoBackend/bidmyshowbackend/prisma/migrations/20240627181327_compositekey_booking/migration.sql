-- AlterTable
CREATE SEQUENCE booking_booking_id_seq;
ALTER TABLE "Booking" ALTER COLUMN "booking_id" SET DEFAULT nextval('booking_booking_id_seq');
ALTER SEQUENCE booking_booking_id_seq OWNED BY "Booking"."booking_id";
