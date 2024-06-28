import React from "react";
import {
  showsDetailAtom,
  highlightedShowDetailAtom,
  userDetailsAtom,
  popupStatus,
  navLinkAtom,
} from "../store/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const Payment = () => {
  const highlightedShow = useRecoilValue(highlightedShowDetailAtom);
  const showDetails = useRecoilValue(showsDetailAtom);
  const [userDetails, setUserDetails] = useRecoilState(userDetailsAtom);
  const { date, time } = beautifyDateTime(
    showDetails[highlightedShow].start_time
  );
  const setPopup = useSetRecoilState(popupStatus);
  const navigate = useNavigate();
  const setNavVariable = useSetRecoilState(navLinkAtom);

  async function processPayment(e) {
    e.preventDefault();
    const show_id = showDetails[highlightedShow].id;
    const user_id = userDetails.id;
    const res = await axios.post("http://localhost:3000/user/booking", {
      user_id,
      show_id,
    });
    console.log(res);
    setPopup((popup) => ({
      ...popup,
      active: true,
      message: res.data.message,
      type: res.data.status === true ? "success" : "error",
    }));
    if (res.data.status) {
      setUserDetails((u) => ({
        ...u,
        balance: u.balance - showDetails[highlightedShow].ticket_price,
      }));
    }
    console.log(userDetails);
    setNavVariable("home");
    navigate("/home");
  }
  return (
    <div className="bg-slate-900 flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center mb-4">
        <h2 className="text-2xl font-bold mb-4">
          {showDetails[highlightedShow].name}
        </h2>
        <p className="mb-2">
          <strong>Date:</strong> {date.split("at")[0]}
        </p>
        <p className="mb-2">
          <strong>Time:</strong> {time}
        </p>
        <p className="mb-2">
          <strong>Location:</strong> {showDetails[highlightedShow].end_time}
        </p>
        <p className="mb-4">
          <strong>Amount to be paid:</strong> ₹
          {showDetails[highlightedShow].ticket_price}
        </p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={processPayment}
        >
          Pay Now
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md text-center">
        <p className="text-xl font-bold">
          <strong>Your Balance:</strong> ₹{userDetails.balance}
        </p>
      </div>
    </div>
  );
};

export default Payment;
