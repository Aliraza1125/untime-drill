"use client";
import React, { useState, useEffect } from "react";
import "./TopBar.css"; // Ensure to include your styles
import "./notes-section.css";
import ReactPlayer from "react-player";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

const TopBar = ({ timed }) => {
  const [textSizeDropdown, setTextSizeDropdown] = useState(false);
  const [menuopen, setMenuopen] = useState(false);

  const [selectedTextSize, setSelectedTextSize] = useState("Default");
  const [lineSpaceDropdown, setLineSpaceDropdown] = useState(false);
  const [selectedLineSpace, setSelectedLineSpace] = useState("Default"); // State for line spacing
  const [minutes, setMinutes] = useState(35);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timeBarWidth, setTimeBarWidth] = useState(100);
  const [secondsCounter, setSecondsCounter] = useState(0);
  const textSizeOptions = ["Small", "Default", "Large", "Extra Large"];
  const htmlFontSizes = ["52.5%", "62.5%", "87.5%", "110%"];
  const lineSpacingOptions = ["Default", "Medium", "Large"];
  const lineSpacingSizes = ["2.5ch", "4ch", "6ch"];
  const [sec, setSec] = useState(0);
  const [content, setContent] = useState("");
  const [tab, setTab] = useState(1);

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ color: [] }],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
    "align",
    "color",
    "code-block",
  ];

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  useEffect(() => {
    const tools = document.querySelectorAll(".tool-icon");
    const main = document.querySelector("main");

    function handleToolClick(event) {
      tools.forEach((tool) => tool.classList.remove("selected"));
      event.currentTarget.classList.add("selected");
    }

    tools.forEach((tool) => {
      tool.addEventListener("click", handleToolClick);
    });

    function modifySelection() {
      var selectedTool = document.querySelector(".tool-icon.selected");
      if (!selectedTool) return;

      var selection = window.getSelection();
      if (!selection.rangeCount) return;

      var range = selection.getRangeAt(0);

      if (selectedTool.classList.contains("eraser-button")) {
        let parent = range.commonAncestorContainer;

        // If the selection is inside a <b> tag, unwrap it
        if (parent.nodeType === 3) {
          parent = parent.parentNode;
        }

        if (parent.nodeName === "B") {
          let unwrappedText = document.createTextNode(parent.textContent);

          parent.replaceWith(unwrappedText);
          selection.removeAllRanges();
        }
      } else {
        // Apply new highlighting
        if (
          selection.anchorNode.parentNode === selection.focusNode.parentNode
        ) {
          var span = document.createElement("b");
          span.className = `${selectedTool.classList[1]}er`;
          range.surroundContents(span);
          selection.removeAllRanges();
        }
      }
    }

    if (main) {
      main.addEventListener("mouseup", modifySelection);
    }

    return () => {
      tools.forEach((tool) =>
        tool.removeEventListener("click", handleToolClick)
      );
      if (main) {
        main.removeEventListener("mouseup", modifySelection);
      }
    };
  }, []);

  const [isRunning, setIsRunning] = useState(true); // State to track if the counter is running

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        setSec((prev) => prev + 1);
      }, 1000);
    }

    // Cleanup interval on unmount or when paused
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);
  // Update styles dynamically when selectedLineSpace changes
  useEffect(() => {
    const index = lineSpacingOptions.indexOf(selectedLineSpace);
    if (index !== -1) {
      document.querySelectorAll(".statement").forEach((el) => {
        el.style.lineHeight = lineSpacingSizes[index];
      });
      document.querySelector("main .right").style.gap = lineSpacingSizes[index];
      document.querySelector(".right .options").style.gap =
        lineSpacingSizes[index];
    }
  }, [selectedLineSpace]);

  // Update font size in <html> tag when selectedTextSize changes
  useEffect(() => {
    const index = textSizeOptions.indexOf(selectedTextSize);
    if (index !== -1) {
      document.documentElement.style.fontSize = htmlFontSizes[index];
    }
  }, [selectedTextSize]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused) {
        if (minutes === 0 && seconds === 0) {
          console.log("se acabo");
        } else if (seconds === 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          setSeconds((prev) => prev - 1);
          setSecondsCounter((prev) => prev + 1);
        }

        if (secondsCounter === 21) {
          setTimeBarWidth((prev) => prev - 1);
          setSecondsCounter(0);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds, paused, secondsCounter]);

  const togglePause = () => {
    setPaused(!paused);
    setIsRunning((prev) => !prev);
  };

  const formatTime = (time) => time.toString().padStart(2, "0");

  return (
    <>
      {(textSizeDropdown || lineSpaceDropdown) && (
        <div
          onClick={() => {
            setTextSizeDropdown(false);
            setLineSpaceDropdown(false);
          }}
          className="overlay"
        ></div>
      )}
      <div className="top-bar">
        {timed ? (
          <div className="left">
            <div className="exit-button">
              <img src="/icons/x-icon.svg" alt="Exit" />
            </div>
            <button className="submit-button">Submit</button>
          </div>
        ) : (
          <div className="left" />
        )}
        <div className="right">
          <div className="text-tools">
            <img
              src="/icons/underline-icon.svg"
              className="tool-icon underline-button"
              alt="Underline"
            />
            <img
              src="/icons/yellow-highlighter-icon.svg"
              className="tool-icon yellow-highlight"
              alt="Yellow Highlight"
            />
            <img
              src="/icons/pink-highlighter-icon.svg"
              className="tool-icon pink-highlight"
              alt="Pink Highlight"
            />
            <img
              src="/icons/orange-highlighter-icon.svg"
              className="tool-icon orange-highlight"
              alt="Orange Highlight"
            />
            <img
              src="/icons/eraser-icon.svg"
              className="tool-icon eraser-button"
              alt="Eraser"
            />
          </div>
          <div className="separator"></div>
          <div className="display-tools">
            <div>
              <img
                src="/icons/font-size-icon.svg"
                className="text-size-button"
                onClick={() => {
                  setTextSizeDropdown(!textSizeDropdown);
                  setLineSpaceDropdown(false);
                }}
                alt="Font Size"
              />
              {textSizeDropdown && (
                <div className="text-size-dropdown dropdown active">
                  {["Small", "Default", "Large", "Extra Large"].map(
                    (size, index) => (
                      <div
                        key={size}
                        onClick={() => {
                          setSelectedTextSize(size);
                          setTextSizeDropdown(false);
                          setLineSpaceDropdown(false);
                        }}
                      >
                        <span
                          className={
                            selectedTextSize === size ? "selected" : ""
                          }
                        >
                          {size}
                        </span>
                        <input
                          className="text-size-radio"
                          name="text-size"
                          type="radio"
                          checked={selectedTextSize === size} // Use state to check selected size
                          onChange={() => setSelectedTextSize(size)} // Update state when clicked
                        />
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            <div>
              <img
                src="/icons/line-spacing-icon.svg"
                className="line-space-button"
                onClick={() => {
                  setLineSpaceDropdown(!lineSpaceDropdown);
                  setTextSizeDropdown(false);
                }}
                alt="Line Spacing"
              />
              {lineSpaceDropdown && (
                <div className="line-space-dropdown dropdown active">
                  {["Default", "Medium", "Large"].map((space, index) => (
                    <div
                      key={space}
                      onClick={() => {
                        setSelectedLineSpace(space);
                        setTextSizeDropdown(false);
                        setLineSpaceDropdown(false);
                      }}
                    >
                      {" "}
                      {/* Clickable div */}
                      <span
                        className={
                          selectedLineSpace === space ? "selected" : ""
                        }
                      >
                        {space}
                      </span>
                      <input
                        className="line-space-radio"
                        name="line-space"
                        type="radio"
                        checked={selectedLineSpace === space} // Controlled state
                        onChange={() => setSelectedLineSpace(space)} // Update state when clicked
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="separator"></div>
          <div className="timing-tools">
            {!timed ? (
              <div>
                <span>
                  <span style={{ fontWeight: "600" }} id="minutes">
                    {formatTime(Math.floor(sec / 60))}
                  </span>
                  :
                  <span style={{ fontWeight: "600" }} id="seconds">
                    {formatTime(sec % 60)}
                  </span>
                </span>
              </div>
            ) : (
              <div>
                <span>
                  Time remaining: {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </span>
                <div className="time-bar-container">
                  <div
                    className="time-bar"
                    style={{
                      width: `${timeBarWidth}%`,
                      backgroundColor:
                        minutes < 12
                          ? "#ff6a16"
                          : minutes < 25
                          ? "#ffcc16"
                          : "#037101",
                    }}
                  ></div>
                </div>
              </div>
            )}
            <img
              src={
                paused ? "/icons/play-icon.svg" : "/icons/pause-icon.svg"
              }
              className="pause-button"
              onClick={togglePause}
              alt="Pause"
            />
          </div>
          {!timed && (
            <div
              onClick={() => setMenuopen((menuopen) => !menuopen)}
              class="notes-tools"
            >
              <img src="/icons/notes-icon.svg" />
            </div>
          )}
        </div>
      </div>
      {menuopen && (
        <div className="annotations-section">
          <div
            onClick={() => setMenuopen((menuopen) => !menuopen)}
            className="cross-icon"
          >
            <img src="/icons/cross-icon.svg" />
          </div>
          <div className="notes-navigation">
            <h2
              onClick={() => setTab(1)}
              className={`${tab === 1 ? "current" : ""}`}
            >
              Notes
            </h2>
            <h2
              onClick={() => setTab(2)}
              className={`${tab === 2 ? "current" : ""}`}
            >
              Explanations (<span>0</span>)
            </h2>
          </div>
          <div className={`notes-editor ${tab === 1 ? "visible" : ""}`}>
            <div>
              <p>
                Use this space to jot down any thoughts for this question. Your
                notes will be saved and visible the next time you review this
                question.
              </p>
              <div className="">
                <QuillEditor
                  value={content}
                  onChange={handleEditorChange}
                  modules={quillModules}
                  formats={quillFormats}
                  className="custom-container"
                  placeholder="You have no saved notes for this problem yet!"
                />
              </div>
            </div>
            {/* <div contentEditable="true">
              You have no saved notes for this problem yet!
            </div> */}
          </div>
          <div
            className={`notes-editor explanations ${
              tab === 2 ? "visible" : ""
            }`}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
              }}
            >
              <ReactPlayer
                url="https://www.youtube.com/watch?v=zQnBQ4tB3ZA"
                controls={true}
                width={1105}
                height={300}
              />
            </div>
          </div>

          {tab === 1 && (
            <div className="notes-ui">
              <button className="save-button">Save</button>
              <div className="checkbox" />
              <span>Share your notes? (Experimental)</span>
              <img src="/icons/question-icon.svg" />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default TopBar;
