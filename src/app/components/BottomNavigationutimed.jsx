"use client";
import React, { useEffect, useState } from "react";
import "./BottomNavigationuntimed.css"; // Ensure CSS is linked properly

const BottomNavigationuntimed = () => {
  const [disabled, setDisabled] = useState(false);
  return (
    <nav className="bottom-navigation">
      <div className="left">
        <button className="end-button">End</button>
        <span>
          <span>0</span> Answered
        </span>
        <span>
          <span>0</span> Skipped
        </span>
      </div>
      <div className="right">
        <div
          onClick={() => setDisabled(!disabled)}
          className={`checkbox-slider ${!disabled ? "disabled" : ""}`}
        ></div>
        <button className="skip-button">Skip</button>
        <button className="submit-button">Submit</button>
      </div>
    </nav>
  );
};

export default BottomNavigationuntimed;
