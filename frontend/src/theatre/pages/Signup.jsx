import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { popupStatus } from "../store/atoms";
import { useSetRecoilState } from "recoil";

export const OrgSignup = () => {
  const [theatreName, setTheatrename] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const setPopup = useSetRecoilState(popupStatus);
  const navigate = useNavigate();

  const signupTheatre = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/theatre/register",
        {
          name: theatreName,
          password,
          location,
        }
      );

      setPopup((popup) => ({
        ...popup,
        active: true,
        message: "signup successful",
        type: "success",
      }));
      navigate("/org/signin");
    } catch (error) {
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: "Error registering the organizer.",
        type: "error",
      }));
    }
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Sign up</h2>
        </div>
        <form action="">
          <div className="mb-6">
            <label className="block mb-2 font-extrabold" htmlFor="email">
              Name
            </label>
            <input
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              type="text"
              id="theatreName"
              placeholder="Organizer Name"
              onChange={(e) => setTheatreName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-extrabold" htmlFor="email">
              Location
            </label>
            <input
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              type="text"
              id="location"
              placeholder="location"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-extrabold" htmlFor="password">
              Password
            </label>
            <input
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              type="password"
              id="password"
              placeholder="**********"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap -mx-4 mb-6 items-center justify-between">
            <div className="w-full lg:w-auto px-4 mb-4 lg:mb-0">
              <label htmlFor="remember">
                {/* <input type="checkbox" id="remember" /> */}
                <span className="ml-1 font-extrabold"></span>
              </label>
            </div>
            <div className="w-full lg:w-auto px-4">
              <a
                className="inline-block font-extrabold hover:underline"
                href="#"
              ></a>
            </div>
          </div>
          <button
            className="inline-block w-full py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-indigo-800 hover:bg-indigo-900 border-3 border-indigo-900 shadow rounded transition duration-200"
            onClick={signupTheatre}
          >
            Sign up
          </button>
        </form>
        <p className="text-center font-extrabold">
          Already have an account?{" "}
          <a className="text-red-500 hover:underline" href="/org/signin">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};
