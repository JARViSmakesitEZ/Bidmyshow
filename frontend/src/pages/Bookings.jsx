import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userDetailsAtom } from "../store/atoms";
import { Skeleton } from "../components/Skeleton";

const Bookings = () => {
  const navigate = useNavigate();
  const userDetails = useRecoilValue(userDetailsAtom);
  const [bookingsData, setBookingsData] = useState([]);
  const [biddingStatus, setBiddingStatus] = useState({});
  const [bookingStatus, setBookingStatus] = useState("mine");
  const [loading, setLoading] = useState(true); // New state to handle loading

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/user/booking/" + userDetails.id
        );
        setBookingsData(response.data);
        // Initialize the bidding status state
        const initialBiddingStatus = response.data.reduce((acc, booking) => {
          acc[booking.id] = booking.bidding;
          return acc;
        }, {});
        setBiddingStatus(initialBiddingStatus);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchBookings();
  }, [userDetails.id]);

  const f1 = async (bookingId) => {
    try {
      const response = await axios.post("http://localhost:3000/user/postbid", {
        user_id: userDetails.id,
        booking_id: bookingId,
      });
      // Initialize the bidding status state
      const initialBiddingStatus = response.data.reduce((acc, booking) => {
        acc[booking.id] = booking.bidding;
        setBookingStatus("bidding");
        return acc;
      }, {});
      setBiddingStatus(initialBiddingStatus);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setBiddingStatus({ ...biddingStatus, [bookingId]: true });
  };

  const f2 = async (bookingId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/acceptbid",
        {
          user_id: userDetails.id,
          booking_id: bookingId,
        }
      );
      // Initialize the bidding status state
      setBookingStatus("sold");
      navigate("/bookings");
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setBiddingStatus({ ...biddingStatus, [bookingId]: true });
  };

  console.log(bookingsData);

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-4xl mx-auto mt-10 space-y-6">
          {loading ? (
            <Skeleton />
          ) : bookingsData.length > 0 ? (
            bookingsData.map((booking) => (
              <div
                key={booking.id}
                className="p-4 bg-white rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-sm font-bold ${
                      biddingStatus[booking.id]
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    {biddingStatus[booking.id] ? "Up for Bidding" : ""}
                  </span>
                  {biddingStatus[booking.id] && bookingStatus !== "bidding" ? (
                    <div className="text-sm text-gray-700">
                      {booking.highestBidder ? (
                        <>
                          Highest Bidder: {booking.highestBidder.name} ( ₹
                          {booking.highestBidder.amount})
                          <button
                            className="ml-4 bg-slate-900 text-white py-1 px-3 rounded hover:bg-slate-700 active:bg-slate-800"
                            onClick={() => f2(booking.id)}
                          >
                            Accept Bid
                          </button>
                        </>
                      ) : (
                        "No bids yet"
                      )}
                    </div>
                  ) : (
                    <button
                      className="ml-4 bg-red-900 text-white py-1 px-3 rounded hover:bg-slate-700 active:bg-slate-800"
                      onClick={() => f1(booking.id)}
                    >
                      Post For Bidding
                    </button>
                  )}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {booking.showname}
                </div>
                <div className="text-gray-700">
                  Amount Paid: {booking.amount}
                </div>
                {booking.status === "sold" && (
                  <div className="text-gray-500 text-right">Sold</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center mt-20">
              <div className="text-2xl font-semibold text-gray-800">
                No Bookings Found
              </div>
              <div className="text-gray-600">
                You have no bookings at the moment. Please check back later.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
