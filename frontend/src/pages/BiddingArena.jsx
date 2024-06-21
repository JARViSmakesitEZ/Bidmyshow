import React, { useState } from "react";
import { Navbar } from "../components/Navbar";

const user = {
  balance: "$500.00",
};

const biddingData = [
  {
    id: 1,
    userId: "U123",
    userName: "Alice Johnson",
    showName: "Concert XYZ",
    highestBid: "$60.00",
  },
  {
    id: 2,
    userId: "U456",
    userName: "Bob Smith",
    showName: "Theater ABC",
    highestBid: "$75.00",
  },
  // Add more bookings up for bidding as needed
];

const BiddingArena = () => {
  const [bidAmounts, setBidAmounts] = useState({});

  const handleInputChange = (event, id) => {
    const { value } = event.target;
    setBidAmounts({ ...bidAmounts, [id]: value });
  };

  const handleBid = (id) => {
    // Implement the bid logic here
    console.log(`Bid placed for booking ${id}: ${bidAmounts[id]}`);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto mt-10">
          <div className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Balance: {user.balance}
            </h2>
          </div>
          <div className="space-y-6">
            {biddingData.map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-white rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-700">
                    UserID: {booking.userId} - Username: {booking.userName}
                  </div>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {booking.showName}
                </div>
                <div className="text-gray-700 mb-2">
                  Highest Bid: {booking.highestBid}
                </div>
                <input
                  type="number"
                  className="w-full px-3 py-2 mb-2 border rounded"
                  placeholder="Enter your bid"
                  value={bidAmounts[booking.id] || ""}
                  onChange={(e) => handleInputChange(e, booking.id)}
                />
                <button
                  className="bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-700 active:bg-slate-800"
                  onClick={() => handleBid(booking.id)}
                >
                  Bid
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingArena;
