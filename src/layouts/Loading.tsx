"use client";

import React from "react";
import "./Loader.css"; // keep your CSS in a separate file

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="justify-content-center jimu-primary-loading"></div>
    </div>
  );
};

export default Loader;
