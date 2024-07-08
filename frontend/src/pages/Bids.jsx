import React from "react";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { userDetailsAtom } from "../store/atoms";
import { useRecoilValue } from "recoil";
import { Skeleton } from "../components/Skeleton";
import axios from "axios";

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
  const userDetails = useRecoilValue(userDetailsAtom);
  const [bidsData, setBidsData] = useState([]);
  const [loading, setLoading] = useState(true); // New state to handle loading
  console.log(userDetails.id);
  useEffect(() => {
    const fetchBids = async () => {
      const token = localStorage.getItem("bidMyShowToken");
      if (!token) {
        throw new Error("No token found");
      }
      try {
        const response = await axios.get(
          "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/common/bids/" +
            userDetails.user.id,
          {
            headers: {
              Authorization: `Bearer ${token.split(" ")[1]}`,
            },
          }
        );
        console.log(response.data);
        setBidsData(response.data);
      } catch (error) {
        console.error("Error fetching bids:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchBids();
  }, []);

  console.log(bidsData);
  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
          {loading ? (
            <Skeleton />
          ) : bidsData.length > 0 ? (
            bidsData.map((bid) => (
              <div key={bid.id} className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-700">
                    Booking ID: {bid.booking_id}
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
                <div className="text-gray-700">Amount: {bid.amount}</div>
              </div>
            ))
          ) : (
            <div className="text-center mt-20">
              <div className="text-2xl font-semibold text-gray-800">
                No Bids Found
              </div>
              <div className="text-gray-600">
                You have no bids at the moment. Please check back later.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bids;
