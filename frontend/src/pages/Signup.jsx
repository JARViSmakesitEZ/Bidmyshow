import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";
import { popupStatus } from "../store/atoms";
import { useSetRecoilState } from "recoil";

export const Signup = () => {
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setPopup = useSetRecoilState(popupStatus);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/common/interest"
        );
        setInterests(response.data);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchInterests();
  }, []);

  const signupUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user/register", {
        name: username,
        password,
        interests: selectedInterests,
        balance: 5000,
        email,
      });

      setPopup((popup) => ({
        ...popup,
        active: true,
        message: "signin successful",
        type: "success",
      }));
      navigate("/signin");
    } catch (error) {
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: "Error registering user",
        type: "error",
      }));
    }
  };

  const handleButtonClick = (interest) => {
    setSelectedInterests((prevSelected) =>
      prevSelected.includes(interest)
        ? prevSelected.filter((item) => item !== interest)
        : [...prevSelected, interest]
    );
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
              Username
            </label>
            <input
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              type="text"
              id="username"
              placeholder="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-extrabold" htmlFor="email">
              Email
            </label>
            <input
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              type="text"
              id="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
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
          <label className="block mb-2 font-extrabold" htmlFor="email">
            Interests
          </label>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {interests.map((i) => (
              <div key={i.id} className="flex flex-col items-center">
                <Button
                  data={i.name}
                  onClick={() => handleButtonClick(i.name)}
                  isSelected={selectedInterests.includes(i.name)}
                />
              </div>
            ))}
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
            onClick={signupUser}
          >
            Sign up
          </button>
        </form>
        <p className="text-center font-extrabold">
          Already have an account?{" "}
          <a className="text-red-500 hover:underline" href="/signin">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};
