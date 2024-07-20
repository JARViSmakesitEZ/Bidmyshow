import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/Button";
import { popupStatus, navLinkAtom, userDetailsAtom } from "../store/atoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import axios from "axios";

const RegisterShow = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const userDetails = useRecoilValue(userDetailsAtom);
  const setPopup = useSetRecoilState(popupStatus);
  const setNavVariable = useSetRecoilState(navLinkAtom);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_time: "",
    end_time: "",
    total_seats: "",
    booked_seats: "",
    ticket_price: "",
  });

  const handleButtonClick = (interest) => {
    setSelectedInterests((prevSelected) =>
      prevSelected.includes(interest)
        ? prevSelected.filter((item) => item !== interest)
        : [...prevSelected, interest]
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTimeISO = new Date(formData.start_time).toISOString();
    const endTimeISO = new Date(formData.end_time).toISOString();
    const showData = {
      ...formData,
      start_time: startTimeISO,
      end_time: endTimeISO,
    };
    const res = await axios.post(
      "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/theatre/registershow",
      {
        ...showData,
        theatre_id: userDetails.user.id,
        interests: selectedInterests,
      }
    );
    setPopup((popup) => ({
      ...popup,
      active: true,
      message: res.data.message,
      type: res.data.status === true ? "success" : "error",
    }));

    if (res.data.status) {
      setNavVariable("home");
      navigate("/org/home");
    }
  };

  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await axios.get(
          "https://honobackendbidmyshow.ghoshgourav9211.workers.dev/common/interest"
        );
        setInterests(response.data);
      } catch (error) {
        console.error("Error fetching interests:", error);
      }
    };

    fetchInterests();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Register Show
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="showName"
              >
                Show Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="showName"
                name="name"
                type="text"
                value={formData.showname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="startTime"
              >
                Start Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startTime"
                name="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="endTime"
              >
                End Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endTime"
                name="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="totalSeats"
              >
                Total Seats
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="totalSeats"
                name="total_seats"
                type="number"
                value={formData.total_seats}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="bookedSeats"
              >
                Booked Seats
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="bookedSeats"
                name="booked_seats"
                type="number"
                value={formData.booked_seats}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="ticketPrice"
              >
                Ticket Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="ticketPrice"
                name="ticket_price"
                type="number"
                value={formData.ticket_price}
                onChange={handleChange}
                required
              />
            </div>

            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Tags
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
            <div className="flex justify-center mt-6">
              <button
                className="bg-slate-900 text-white py-2 px-4 rounded hover:bg-slate-700 active:bg-slate-800"
                type="submit"
              >
                Register Show
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterShow;
