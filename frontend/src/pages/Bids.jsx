import React from "react";
import { Navbar } from "../components/Navbar";

const bidsData = [
  {
    id: 1,
    bookingId: "B123",
    showName: "Concert XYZ",
    amount: "$60.00",
    status: "pending",
  },
  {
    id: 2,
    bookingId: "B456",
    showName: "Theater ABC",
    amount: "$75.00",
    status: "captured",
  },
  {
    id: 3,
    bookingId: "B789",
    showName: "Magic Show DEF",
    amount: "$40.00",
    status: "accepted",
  },
  // Add more bids as needed
];

const Bids = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
          {bidsData.map((bid) => (
            <div key={bid.id} className="p-4 bg-white rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-700">
                  Booking ID: {bid.bookingId}
                </div>
                <div
                  className={`text-sm font-bold ${
                    bid.status === "pending"
                      ? "text-white bg-gray-500"
                      : bid.status === "captured"
                      ? "text-red-500"
                      : "text-green-500"
                  } rounded px-2 py-1`}
                >
                  {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {bid.showName}
              </div>
              <div className="text-gray-700">Amount: {bid.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bids;
