"use client";
import { useState } from "react";
import "./Questionnaire.css"; // Ensure CSS is linked properly

const Questionnaire = ({ flaggedQuestions, toggleFlag, timed }) => {
  const [hiddenOptions, setHiddenOptions] = useState({});
  const [selectedOption, setSelectedOption] = useState(null); // Track selected option

  const toggleVisibility = (index) => {
    setHiddenOptions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleOptionClick = (index) => {
    setSelectedOption((prev) => (prev === index ? null : index)); // Toggle selection
  };

  const questions = [
    "Fiesta is released second",
    "Glaciers is released third",
    "Hurricanes is released fourth",
    "Kangaroos is released fourth",
    "Kangaroos is released fifth",
  ];

  return (
    <main className="wrapper visible">
      <div className="left">
        <p className="statement">
          A movie studio is scheduling the release of six films -- Fiesta,
          Glaciers, Hurricanes, Jets, Kangaroos, and Lovebird. No two of these
          films can be released on the same date. The release schedule is
          governed by the following conditions:
        </p>
        <p className="statement indented">
          Fiesta must be released earlier than both Jets and Lovebird.
        </p>
        <p className="statement indented">
          Kangaroos must be released earlier than Jets, and Jets must be
          released earlier than Hurricanes.
        </p>
        <p className="statement indented">
          Lovebird must be released earlier than Glaciers.
        </p>
      </div>
      <div className="right">
        <div className="question">
          <span>1. Which one of the following CANNOT be true?</span>
          <img
            className={`blue-flag ${
              timed && flaggedQuestions[1] ? "filled" : ""
            }`}
            src={
              flaggedQuestions[1]
                ? "/icons/filled-flag-icon.png"
                : "/icons/flag-icon.svg"
            }
            alt="flag"
            onClick={() => toggleFlag(1)}
          />
        </div>
        <div className="options">
          {questions.map((text, index) => (
            <div
              className={`option ${
                !timed && index === 2 ? "green-border" : "white-border"
              }`} // Apply selected class
              key={index}
              onClick={() => handleOptionClick(index)}
            >
              <div style={{ opacity: hiddenOptions[index] ? 0.5 : 1 }}>
                <button
                  className={` ${selectedOption === index ? "selected " : ""}`}
                >
                  {String.fromCharCode(65 + index)}
                </button>
                <p>
                  {!timed && (
                    <>
                      <span
                        style={{
                          color:
                            index === 2
                              ? "green"
                              : index === 1
                              ? "red"
                              : "gray",
                        }}
                      >
                        {index === 2
                          ? "CORRECT"
                          : index === 1
                          ? "INCORRECT(SELECTED)"
                          : "INCORRECT"}
                      </span>
                      <br />
                    </>
                  )}{" "}
                  {text}
                </p>
              </div>
              <div style={{ marginTop: 5 }}>
                <img
                  src="/icons/eye-icon.svg"
                  alt="eye"
                  onClick={() => toggleVisibility(index)}
                />
                {hiddenOptions[index] && <span className="eye-slash" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Questionnaire;
