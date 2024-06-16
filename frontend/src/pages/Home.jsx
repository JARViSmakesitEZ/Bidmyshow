import { useEffect, useState } from "react";
import axios from "axios";
import { ShowCard } from "../components/ShowCard"; // Ensure the correct import path
import { Navbar } from "../components/Navbar";

export const Home = () => {
  const [response, setResponse] = useState({ shows: [] });

  useEffect(() => {
    async function send() {
      try {
        const token = localStorage.getItem("bidMyShowToken");
        if (!token) {
          throw new Error("No token found");
        }

        console.log(token); // This will log the token to the console
        const res = await axios.get("http://localhost:3000/user/home", {
          headers: {
            Authorization: `Bearer ${token.split(" ")[1]}`, // Extract the actual token
          },
        });

        setResponse(res.data);
        console.log("User home data:", res.data);
      } catch (error) {
        console.error("Error fetching user home data:", error);
      }
    }

    send();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return (
    <div>
      <Navbar />
      <div className="flex">
        {response.shows && response.shows.length > 0 ? (
          response.shows.map((s, index) => (
            <ShowCard
              key={index}
              name={s.name}
              description={s.description}
              ticket_price={s.ticket_price}
            />
          ))
        ) : (
          <p>No shows available</p>
        )}
      </div>
    </div>
  );
};
