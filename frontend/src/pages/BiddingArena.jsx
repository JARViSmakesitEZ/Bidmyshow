import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useRecoilState, useSetRecoilState } from "recoil";
import { popupStatus, userDetailsAtom, navLinkAtom } from "../store/atoms";
import axios from "axios";
import { Skeleton } from "../components/Skeleton";
import { useNavigate } from "react-router-dom";

const BiddingArena = () => {
  const [auctions, setAuctions] = useState([]);
  const [userDetails, setUserDetails] = useRecoilState(userDetailsAtom);
  const [loading, setLoading] = useState(true);
  const [biddingAmount, setBiddingAmount] = useState(0);
  const [navVariable, setNavVariable] = useRecoilState(navLinkAtom);
  const setPopup = useSetRecoilState(popupStatus);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const token = localStorage.getItem("bidMyShowToken");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(
          "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/common/auctionbookings",
          {
            headers: {
              Authorization: `Bearer ${token.split(" ")[1]}`,
            },
          }
        );
        setAuctions(response.data);
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchBids();
  }, [navVariable]);

  const handleBid = async (booking_id, user_id) => {
    const bidder_id = userDetails.user.id;
    if (user_id === bidder_id) {
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: "u cannot bid on your own ticket",
        type: false,
      }));
      return;
    }
    const amount = biddingAmount;
    let res = null;
    try {
      const token = localStorage.getItem("bidMyShowToken");
      if (!token) {
        throw new Error("No token found");
      }
      res = await axios.post(
        "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/user/placebid",
        {
          bidder_id,
          booking_id,
          user_id,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token.split(" ")[1]}`,
          },
        }
      );
      res = res.data;
      console.log(res);
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: res.message,
        type: res.status == true ? "success" : "error",
      }));
      setNavVariable("biddingArena");
      navigate("/home");
    } catch (err) {
      console.log(err);
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: "some error occured",
        type: "error",
      }));
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto mt-10">
          <div className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Balance: ₹{userDetails.user.balance}
            </h2>
          </div>
          <div className="space-y-6">
            {loading ? (
              <Skeleton />
            ) : auctions.length > 0 ? (
              auctions.map((booking) => (
                <div
                  key={booking.booking_id}
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
                    {booking.highestBid
                      ? `Highest Bid: ₹${booking.highestBid}`
                      : "no bids yet"}
                  </div>
                  <input
                    type="number"
                    className="w-full px-3 py-2 mb-2 border rounded"
                    placeholder="Enter your bid"
                    value={biddingAmount == 0 ? "" : biddingAmount}
                    onChange={(e) => setBiddingAmount(e.target.value)}
                  />
                  <button
                    className="bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-700 active:bg-slate-800"
                    onClick={() =>
                      handleBid(booking.booking_id, booking.user_id)
                    }
                  >
                    Bid
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center mt-20">
                <div className="text-2xl font-semibold text-gray-800">
                  No Bookings Found
                </div>
                <div className="text-gray-600">
                  no bookings up for bidding at the moment. Please check back
                  later.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingArena;
