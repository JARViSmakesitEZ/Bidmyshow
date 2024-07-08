import { useNavigate } from "react-router-dom";
import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";
import { useState } from "react";
import axios from "axios";
import { userDetailsAtom, popupStatus } from "../store/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useRecoilState(userDetailsAtom);
  const setPopup = useSetRecoilState(popupStatus);
  const navigate = useNavigate();

  async function signinUser(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/user/login",
        {
          email,
          password,
        }
      );
      const token = response.data.token;
      localStorage.setItem("bidMyShowToken", `Bearer ${token}`);
      setUser(response.data);
      console.log(response);
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: "signin successful",
        type: "success",
      }));
      navigate("/home");
    } catch (err) {
      setPopup((popup) => ({
        ...popup,
        active: true,
        message: "email or password wrong",
        type: "error",
      }));
    }
  }
  return (
    <div className="container px-4 mx-auto">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold">Sign in</h2>
        </div>
        <form action="">
          <div className="mb-6">
            <label className="block mb-2 font-extrabold" htmlFor="email">
              Email
            </label>
            <input
              className="inline-block w-full p-4 leading-6 text-lg font-extrabold placeholder-indigo-900 bg-white shadow border-2 border-indigo-900 rounded"
              type="email"
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
          <div className="flex flex-wrap -mx-4 mb-6 items-center justify-between">
            <div className="w-full lg:w-auto px-4 mb-4 lg:mb-0">
              <label htmlFor="remember">
                <input type="checkbox" id="remember" />
                <span className="ml-1 font-extrabold">Remember me</span>
              </label>
            </div>
            <div className="w-full lg:w-auto px-4">
              <a
                className="inline-block font-extrabold hover:underline"
                href="#"
              >
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            className="inline-block w-full py-4 px-6 mb-6 text-center text-lg leading-6 text-white font-extrabold bg-slate-700 hover:bg-slate-900 border-3 border-indigo-900 shadow rounded transition duration-200"
            onClick={(e) => signinUser(e)}
          >
            {" "}
            Sign in{" "}
          </button>
          <p className="text-center font-extrabold">
            Don&rsquo;t have an account?{" "}
            <a
              className="text-red-500 hover:underline"
              href="http://bidmyshow.s3-website.ap-south-1.amazonaws.com/signup"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
