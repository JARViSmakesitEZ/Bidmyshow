import React from "react";
import profilePic from "../../assets/profilepic.png";
import { userDetailsAtom, navLinkAtom } from "../store/atoms";
import { useRecoilValue, useRecoilState } from "recoil";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const user = useRecoilValue(userDetailsAtom);
  console.log(user);
  const [active, setActive] = useRecoilState(navLinkAtom);
  const navigate = useNavigate();
  const handleClick = (page) => {
    console.log("hi i just got clicked");
    setActive(page);
    if (page === "Bookings") navigate("/signin");
    else if (page === "Bids") navigate("/signup");
  };
  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-6">
            <img
              className="w-24 h-24 rounded-full"
              src={profilePic}
              alt="User Profile"
            />
            <h1 className="text-2xl font-semibold text-gray-900">
              {user.user.name}
            </h1>
            <div className="w-full">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  value={user.user.email}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  value={user.user.password}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="balance"
                >
                  Balance
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="balance"
                  type="text"
                  value={`₹${user.user.balance}`}
                  readOnly
                />
              </div>
              <div className="flex space-x-4 mt-4">
                <button
                  className="bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-700 active:bg-slate-800"
                  onClick={() => {
                    setActive("Bids");
                    navigate("/user/bids");
                  }}
                >
                  Bids
                </button>
                <button
                  className="bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-700 active:bg-slate-800"
                  onClick={() => {
                    setActive("Bookings");
                    navigate("/user/bookings");
                  }}
                >
                  Bookings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
