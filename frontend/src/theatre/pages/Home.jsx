import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShowCard } from "../components/ShowCard";
import { Navbar } from "../components/Navbar";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { userDetailsAtom, showsDetailAtom, navLinkAtom } from "../store/atoms";
import { Skeleton } from "../components/Skeleton";

export const OrgHome = () => {
  const [response, setResponse] = useState({});
  const [shows, setShows] = useState({ personalized: [], other: [] });
  const [loading, setLoading] = useState(true);
  const userDetails = useRecoilValue(userDetailsAtom);
  const setShowsDetails = useSetRecoilState(showsDetailAtom);
  const [navVariable, setNavVariable] = useRecoilState(navLinkAtom);
  const temp = useRecoilValue(showsDetailAtom);

  async function saveShowDetails(shows) {
    shows.map((s) => {
      setShowsDetails((showDetails) => {
        return { ...showDetails, [s.id]: s }; // Ensure to return a new object reference
      });
    });
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("bidMyShowToken");
        if (!token) {
          throw new Error("No token found");
        }

        const res = await axios.get(
          "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/theatre/home",
          {
            headers: {
              Authorization: `Bearer ${token.split(" ")[1]}`,
            },
          }
        );

        setResponse(res.data);
        await saveShowDetails(res.data.shows);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navVariable]);

  console.log();

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <Skeleton />
          </div>
        ) : (
          <>
            <div className="section">
              <h2 className="text-2xl font-bold mb-4">Your upcoming Shows</h2>
              <div className="flex flex-wrap -m-2">
                {response.shows && response.shows.length > 0 ? (
                  response.shows.map((s) => (
                    <div key={s.id} className="p-2">
                      <ShowCard id={s.id} />
                    </div>
                  ))
                ) : (
                  <p>No shows available</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
