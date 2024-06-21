import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { showDetailAtom } from "../store/atoms";
import { useRecoilState } from "recoil";
import { userDetailsAtom } from "../store/atoms";
import axios from "axios";

export const Show = () => {
  const [showDetail, setShowDetail] = useRecoilState(showDetailAtom);
  const [userDetails, setUserDetails] = useRecoilState(userDetailsAtom);
  const [theatre, setTheatre] = useState({});
  const [show, setShow] = useState({});
  console.log("show detail is " + showDetail);

  useEffect(() => {
    async function getShowDetails() {
      try {
        const token = localStorage.getItem("bidMyShowToken");
        if (!token) {
          throw new Error("No token found");
        }
        const res = await axios.get(
          "http://localhost:3000/common/show/" + showDetail,
          {
            headers: {
              Authorization: `Bearer ${token.split(" ")[1]}`, // Extract the actual token
            },
          }
        );
        setShow(res.data.show);
        setTheatre(res.data.theatre);
      } catch (error) {
        console.error("Error fetching user home data:", error);
      }
    }

    getShowDetails();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  console.log(userDetails);
  return (
    <div>
      <Navbar />
      <div class="bg-gray-100">
        <div class="container mx-auto px-4 py-8">
          <div class="flex flex-wrap -mx-4">
            <div class="w-full lg:w-2/3 px-4 mb-8 lg:mb-0">
              <img
                class="w-full rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b"
                alt="Concert Image"
              />
            </div>
            <div class="w-full lg:w-1/3 px-4">
              <h1 class="text-4xl font-bold mb-4">{show.name}</h1>
              <p class="text-lg mb-6">{show.description}</p>
              <div class="mb-6">
                <p class="text-xl font-bold mb-2">When:</p>
                <p class="text-lg">Friday, April 15th at 8:00 PM</p>
              </div>
              <div class="mb-6">
                <p class="text-xl font-bold mb-2">Where:</p>
                <p class="text-lg">{theatre.name}</p>
                <p class="text-lg">{theatre.location}</p>
              </div>
              <div class="mb-6">
                <p class="text-xl font-bold mb-2">
                  Price : ₹{show.ticket_price}
                </p>
                <p class="text-xl font-bold mb-2">
                  Balance : ₹{userDetails.balance}
                </p>
              </div>
              <div class="mb-6">
                <p class="text-xl font-bold mb-2">
                  Seats Booked : {show.booked_seats}
                </p>
                <p class="text-xl font-bold mb-2">
                  Seats Remaining : {show.total_seats - show.booked_seats}
                </p>
              </div>
              {show.booked_seats !== show.total_seats ? (
                <button
                  class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Buy Tickets
                </button>
              ) : (
                <button
                  class="bg-gray-300 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Housefull
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
