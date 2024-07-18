// src/components/Logo.js
import React from "react";

const Logo = () => {
  return (
    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
      <img src="../../src/logo.png" className="h-8" alt="BidMyShow Logo" />
      <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
        BidMyShow
      </span>
    </a>
  );
};

export default Logo;
