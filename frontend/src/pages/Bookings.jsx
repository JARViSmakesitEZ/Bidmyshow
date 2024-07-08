import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { userDetailsAtom, navLinkAtom } from "../store/atoms";
import { Skeleton } from "../components/Skeleton";
import { popupStatus } from "../store/atoms";

const Bookings = () => {
  const navigate = useNavigate();
  const userDetails = useRecoilValue(userDetailsAtom);
  const [bookingsData, setBookingsData] = useState([]);
  const [biddingStatus, setBiddingStatus] = useState({});
  const [bookingStatus, setBookingStatus] = useState({});
  const [loading, setLoading] = useState(true); // New state to handle loading
  const [navVariable, setNavVariable] = useRecoilState(navLinkAtom);
  const setPopup = useSetRecoilState(popupStatus);
  const token = localStorage.getItem("bidMyShowToken");
  if (!token) {
    throw new Error("No token found");
  }

  console.log(userDetails);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/user/booking/" +
            userDetails.user.id,
          {
            headers: {
              Authorization: `Bearer ${token.split(" ")[1]}`,
            },
          }
        );
        setBookingsData(response.data);
        response.data.forEach((booking) => {
          setBiddingStatus((prevState) => ({
            ...prevState,
            [booking.booking_id]: booking.bidding,
          }));
          setBookingStatus((prevState) => ({
            ...prevState,
            [booking.booking_id]: booking.status, // assuming you have a status field
          }));
        });
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchBookings();
  }, [navVariable]);

  const postBid = async (bookingId) => {
    console.log(userDetails.user.id + " " + bookingId);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/user/postbid",
        {
          user_id: userDetails.user.id,
          booking_id: bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${token.split(" ")[1]}`,
          },
        }
      );
      // Initialize the bidding status state
      console.log(response);
      setBiddingStatus((prevState) => ({
        ...prevState,
        [bookingId]: true,
      }));
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: response.data.message,
        type: response.data.status === true ? "success" : "error",
      }));
      setLoading(false);
      setNavVariable("booking");
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
    setBiddingStatus({ ...biddingStatus, [bookingId]: true });
  };

  const acceptBid = async (bookingId) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/user/acceptbid",
        {
          user_id: userDetails.user.id,
          booking_id: bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${token.split(" ")[1]}`,
          },
        }
      );
      // Initialize the bidding status state
      if (response.status) {
        setBookingStatus((prevState) => ({
          ...prevState,
          [bookingId]: "sold",
        }));

        setUserDetails((u) => ({
          ...u,
          user: {
            ...u.user,
            balance: res.data.balance.balance,
          },
        }));
      }
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: response.data.message,
        type: response.data.status === true ? "success" : "error",
      }));
      setLoading(false);
      setBiddingStatus({ ...biddingStatus, [bookingId]: false });
      setNavVariable("booking");
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
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
                className="p-4 bg-white rounded-lg shadow-md border-4 border-slate-900" // Added border class
              >
                <div className="flex justify-between items-center mb-2">
                  <span
                    className={`text-sm font-bold ${
                      biddingStatus[booking.id]
                        ? "text-green-500"
                        : "text-black"
                    }`}
                  >
                    {biddingStatus[booking.booking_id] &&
                    bookingStatus[booking.booking_id] === "own"
                      ? "Up for Bidding"
                      : ""}
                  </span>
                  {biddingStatus[booking.booking_id] ? (
                    <div className="text-sm text-gray-700">
                      {booking.highestBidder ? (
                        <>
                          Highest Bidder: {booking.highestBidder.name} ( ₹
                          {booking.highestBidder.amount})
                          {bookingStatus[booking.booking_id] !== "sold" && (
                            <button
                              className="ml-4 bg-slate-900 text-white py-1 px-3 rounded hover:bg-slate-700 active:bg-slate-800"
                              onClick={() => acceptBid(booking.booking_id)}
                            >
                              Accept Bid
                            </button>
                          )}
                        </>
                      ) : (
                        "No bids yet"
                      )}
                    </div>
                  ) : (
                    bookingStatus[booking.booking_id] !== "sold" && (
                      <button
                        className="ml-4 bg-red-900 text-white py-1 px-2 rounded hover:bg-slate-700 active:bg-slate-800"
                        onClick={() => postBid(booking.booking_id)}
                      >
                        Post Bid
                      </button>
                    )
                  )}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {booking.showname}
                </div>
                <div className="text-gray-700">
                  Amount Paid: {booking.amount}
                </div>
                {bookingStatus[booking.booking_id] === "sold" && (
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
