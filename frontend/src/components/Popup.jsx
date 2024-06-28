import React from "react";
import { popupStatus } from "../store/atoms";
import { useRecoilState } from "recoil";

const Popup = () => {
  const [popup, setPopup] = useRecoilState(popupStatus);
  const getIcon = () => {
    if (popup.type === "success") {
      return (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      );
    } else if (popup.type === "error") {
      return (
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      );
    }
    return null;
  };

  if (!popup.active) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative p-4 w-80 bg-white rounded-lg shadow-lg">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={() => {
            setPopup((popup) => ({
              ...popup,
              active: false,
            }));
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
        <div className="flex items-center space-x-4">
          {getIcon()}
          <span className="text-lg">{popup.message}</span>
        </div>
      </div>
    </div>
  );
};

export default Popup;
