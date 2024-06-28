import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="text-center p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-6">Welcome to BidMyShow</h1>
        <p className="text-lg mb-8">Book your tickets with ease</p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
          <button
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
