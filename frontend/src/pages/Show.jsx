import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { showsDetailAtom } from "../store/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userDetailsAtom, highlightedShowDetailAtom } from "../store/atoms";
import { Skeleton } from "../components/Skeleton";
import axios from "axios";

function beautifyDateTime(sqlDateTime) {
  const dateObj = new Date(sqlDateTime);

  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = dateObj.toLocaleDateString("en-US", options);
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const [date, year] = formattedDate.split(",");
  const [month, day] = date.split(" ");

  const daySuffix = (d) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return {
    date: `${parseInt(day)}${daySuffix(parseInt(day))} ${month} ${year.trim()}`,
    time: formattedTime.toUpperCase(),
  };
}

export const Show = () => {
  const [showDetail, setShowDetail] = useRecoilState(showsDetailAtom);
  const [userDetails, setUserDetails] = useRecoilState(userDetailsAtom);
  const [highlightedShow, setHighlightedShow] = useRecoilState(
    highlightedShowDetailAtom
  );
  const [theatre, setTheatre] = useState({});
  const [show, setShow] = useState({});
  const [loading, setLoading] = useState(true); // New state to handle loading
  const navigate = useNavigate();
  const { date, time } = beautifyDateTime(
    showDetail[highlightedShow].start_time
  );

  useEffect(() => {
    async function getShowDetails() {
      try {
        const token = localStorage.getItem("bidMyShowToken");
        if (!token) {
          throw new Error("No token found");
        }
        const res = await axios.get(
          "http://localhost:3000/common/show/" + highlightedShow,
          {
            headers: {
              Authorization: `Bearer ${token.split(" ")[1]}`, // Extract the actual token
            },
          }
        );
        setShow(res.data.show);
        setTheatre(res.data.theatre);
      } catch (error) {
        console.error("Error fetching show details:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    }

    getShowDetails();
  }, [showDetail]); // Added showDetail as a dependency

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          {loading ? (
            <Skeleton />
          ) : (
            <div className="flex flex-wrap -mx-4">
              <div className="w-full lg:w-2/3 px-4 mb-8 lg:mb-0">
                <img
                  className="w-full rounded-lg shadow-lg"
                  src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b"
                  alt="Concert Image"
                />
              </div>
              <div className="w-full lg:w-1/3 px-4">
                <h1 className="text-4xl font-bold mb-4">{show.name}</h1>
                <p className="text-lg mb-6">{show.description}</p>
                <div className="mb-6">
                  <p className="text-xl font-bold mb-2">When:</p>
                  <p className="text-lg">{date}</p>
                </div>
                <div className="mb-6">
                  <p className="text-xl font-bold mb-2">Where:</p>
                  <p className="text-lg">{theatre.name}</p>
                  <p className="text-lg">{theatre.location}</p>
                </div>
                <div className="mb-6">
                  <p className="text-xl font-bold mb-2">
                    Price : ₹{show.ticket_price}
                  </p>
                  <p className="text-xl font-bold mb-2">
                    Balance : ₹{userDetails.balance}
                  </p>
                </div>
                <div className="mb-6">
                  <p className="text-xl font-bold mb-2">
                    Seats Booked : {show.booked_seats}
                  </p>
                  <p className="text-xl font-bold mb-2">
                    Seats Remaining : {show.total_seats - show.booked_seats}
                  </p>
                </div>
                {show.booked_seats !== show.total_seats ? (
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => {
                      setHighlightedShow(show.id);
                      navigate("/payment");
                    }}
                  >
                    Buy Tickets
                  </button>
                ) : (
                  <button
                    className="bg-gray-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                  >
                    Housefull
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
