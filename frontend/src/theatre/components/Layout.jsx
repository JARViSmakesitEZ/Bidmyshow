// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="mt-16">{children}</div>
    </div>
  );
};

export default Layout;
