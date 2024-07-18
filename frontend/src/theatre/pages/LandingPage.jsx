import React from "react";
import { useNavigate } from "react-router-dom";

const OrgLandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg transform transition-all hover:scale-105">
        <h1 className="text-5xl font-extrabold mb-6 text-gray-800">
          Welcome to BidMyShow
        </h1>
        <p className="text-lg mb-8 text-gray-600">
          Register your shows with ease
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-600 hover:shadow-lg transform transition-all hover:scale-105"
            onClick={() => navigate("/org/signup")}
          >
            Sign Up
          </button>
          <button
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transform transition-all hover:scale-105"
            onClick={() => navigate("/org/signin")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrgLandingPage;
