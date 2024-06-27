import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useRecoilState } from "recoil";
import { userDetailsAtom } from "../store/atoms";
import axios from "axios";
import Skeleton from "../components/Skeleton";

const BiddingArena = () => {
  const [auctions, setAuctions] = useState([]);
  const [userDetails, setUserDetails] = useRecoilState(userDetailsAtom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/common/auctionbookings/"
        );
        setAuctions(response.data);
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchBids();
  }, [userDetails.id]);

  const handleInputChange = (event, id) => {
    const { value } = event.target;
    // Implement logic to handle input change
  };

  const handleBid = (id) => {
    // Implement the bid logic here
    console.log(`Bid placed for booking ${id}`);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto mt-10">
          <div className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Balance: ₹{userDetails.balance}
            </h2>
          </div>
          <div className="space-y-6">
            {loading ? (
              <Skeleton />
            ) : (
              auctions.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-white rounded-lg shadow-md"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-700">
                      UserID: {booking.user_id} - Username: {booking.User.name}
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {booking.Show.name}
                  </div>
                  <div className="text-gray-700 mb-2">
                    Highest Bid: ₹{booking.highestBid}
                  </div>
                  <input
                    type="number"
                    className="w-full px-3 py-2 mb-2 border rounded"
                    placeholder="Enter your bid"
                    value={booking.bidAmount || ""}
                    onChange={(e) => handleInputChange(e, booking.id)}
                  />
                  <button
                    className="bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-700 active:bg-slate-800"
                    onClick={() => handleBid(booking.id)}
                  >
                    Bid
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingArena;
