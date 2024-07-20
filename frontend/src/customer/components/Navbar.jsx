import React, { useState } from "react";
import { navLinkAtom } from "../store/atoms";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/logo.png";

export const Navbar = () => {
  const [active, setActive] = useRecoilState(navLinkAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (page) => {
    setActive(page);
    setIsMenuOpen(false); // Close the menu when an item is clicked
    if (page === "Home") navigate("/user/home");
    else if (page === "Bookings") navigate("/user/bookings");
    else if (page === "Bids") navigate("/user/bids");
    else if (page === "Account") navigate("/user/profile");
    else if (page === "BiddingArena") navigate("/user/biddingarena");
  };

  const handleLogout = () => {
    setActive("");
    navigate("/", { replace: true }); // replace: true prevents going back
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <img
          src={Logo}
          alt="BidMyShow logo"
          className="w-14 h-14 rounded-full"
        />
        <div className="flex md:order-2">
          <button
            type="button"
            onClick={handleLogout}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1 font-bold"
          >
            Logout
          </button>
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } items-center justify-between w-full md:flex md:w-auto md:order-1`}
          id="navbar-search"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <a
                href="#"
                onClick={() => handleClick("Home")}
                className={`block py-2 px-3 rounded md:p-0 ${
                  active === "Home"
                    ? "text-blue-700"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => handleClick("Bookings")}
                className={`block py-2 px-3 rounded md:p-0 ${
                  active === "Bookings"
                    ? "text-blue-700"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Bookings
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => handleClick("Bids")}
                className={`block py-2 px-3 rounded md:p-0 ${
                  active === "Bids"
                    ? "text-blue-700"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Bids
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => handleClick("BiddingArena")}
                className={`block py-2 px-3 rounded md:p-0 ${
                  active === "BiddingArena"
                    ? "text-blue-700"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                BiddingArena
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={() => handleClick("Account")}
                className={`block py-2 px-3 rounded md:p-0 ${
                  active === "Account"
                    ? "text-blue-700"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                Account
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
