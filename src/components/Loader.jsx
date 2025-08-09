import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-wrapper">
      <div className="loader-circle"></div>
      <h2 className="loader-brand">SmartFood</h2>
      <p className="loader-status">Loading, please wait...</p>
    </div>
  );
};

export default Loader;
