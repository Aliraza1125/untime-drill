"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import "./TopBar.css";
import "./notes-section.css";
import ReactPlayer from "react-player";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import History from '@tiptap/extension-history'
import MenuBar  from "./MenuBar"

const TopBar = ({ timed }) => {
  const [textSizeDropdown, setTextSizeDropdown] = useState(false);
  const [menuopen, setMenuopen] = useState(false);
  const [selectedTextSize, setSelectedTextSize] = useState("Default");
  const [lineSpaceDropdown, setLineSpaceDropdown] = useState(false);
  const [selectedLineSpace, setSelectedLineSpace] = useState("Default");
  const [minutes, setMinutes] = useState(35);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timeBarWidth, setTimeBarWidth] = useState(100);
  const [secondsCounter, setSecondsCounter] = useState(0);
  const [sec, setSec] = useState(0);
  const [tab, setTab] = useState(1);
  const [isRunning, setIsRunning] = useState(true);
  const sidebarRef = useRef(null);

  const textSizeOptions = ["Small", "Default", "Large", "Extra Large"];
  const htmlFontSizes = ["52.5%", "62.5%", "87.5%", "110%"];
  const lineSpacingOptions = ["Default", "Medium", "Large"];
  const lineSpacingSizes = ["2.5ch", "4ch", "6ch"];

  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
      Link,
      History,
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
        bold: false,
        italic: false,
        strike: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        history: false,
      })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose focus:outline-none',
      },
    },
  });

  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        const notesTools = document.querySelector('.notes-tools');
        if (!notesTools?.contains(event.target)) {
          setMenuopen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle text tools
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
      const selectedTool = document.querySelector(".tool-icon.selected");
      if (!selectedTool) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      if (selectedTool.classList.contains("eraser-button")) {
        let parent = range.commonAncestorContainer;
        if (parent.nodeType === 3) {
          parent = parent.parentNode;
        }
        if (parent.nodeName === "B") {
          const unwrappedText = document.createTextNode(parent.textContent);
          parent.replaceWith(unwrappedText);
          selection.removeAllRanges();
        }
      } else {
        if (selection.anchorNode.parentNode === selection.focusNode.parentNode) {
          const span = document.createElement("b");
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
      tools.forEach((tool) => tool.removeEventListener("click", handleToolClick));
      if (main) {
        main.removeEventListener("mouseup", modifySelection);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Line spacing effect
  useEffect(() => {
    const index = lineSpacingOptions.indexOf(selectedLineSpace);
    if (index !== -1) {
      document.querySelectorAll(".statement").forEach((el) => {
        el.style.lineHeight = lineSpacingSizes[index];
      });
      const rightElement = document.querySelector("main .right");
      const optionsElement = document.querySelector(".right .options");
      
      if (rightElement) {
        rightElement.style.gap = lineSpacingSizes[index];
      }
      if (optionsElement) {
        optionsElement.style.gap = lineSpacingSizes[index];
      }
    }
  }, [selectedLineSpace, lineSpacingOptions, lineSpacingSizes]);

  // Text size effect
  useEffect(() => {
    const index = textSizeOptions.indexOf(selectedTextSize);
    if (index !== -1) {
      document.documentElement.style.fontSize = htmlFontSizes[index];
    }
  }, [selectedTextSize, textSizeOptions, htmlFontSizes]);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused) {
        if (minutes === 0 && seconds === 0) {
          console.log("Time's up");
        } else if (seconds === 0) {
          setMinutes((prev) => prev - 1);
          setSeconds(59);
        } else {
          setSeconds((prev) => prev - 1);
          setSecondsCounter((prev) => prev + 1);
        }

        if (secondsCounter === 21) {
          setTimeBarWidth((prev) => Math.max(0, prev - 1));
          setSecondsCounter(0);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds, paused, secondsCounter]);

  const togglePause = useCallback(() => {
    setPaused((prev) => !prev);
    setIsRunning((prev) => !prev);
  }, []);

  const formatTime = useCallback((time) => time.toString().padStart(2, "0"), []);

  const handleSave = useCallback(() => {
    if (editor) {
      const content = editor.getHTML();
      console.log('Saving content:', content);
      // Add your save logic here
    }
  }, [editor]);

  return (
    <>
      {(textSizeDropdown || lineSpaceDropdown) && (
        <div
          onClick={() => {
            setTextSizeDropdown(false);
            setLineSpaceDropdown(false);
          }}
          className="overlay"
        />
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
          <div className="separator" />
          <div className="display-tools">
            {/* Font size dropdown */}
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
                  {textSizeOptions.map((size) => (
                    <div
                      key={size}
                      onClick={() => {
                        setSelectedTextSize(size);
                        setTextSizeDropdown(false);
                      }}
                    >
                      <span className={selectedTextSize === size ? "selected" : ""}>
                        {size}
                      </span>
                      <input
                        className="text-size-radio"
                        name="text-size"
                        type="radio"
                        checked={selectedTextSize === size}
                        onChange={() => setSelectedTextSize(size)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Line spacing dropdown */}
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
                  {lineSpacingOptions.map((space) => (
                    <div
                      key={space}
                      onClick={() => {
                        setSelectedLineSpace(space);
                        setLineSpaceDropdown(false);
                      }}
                    >
                      <span className={selectedLineSpace === space ? "selected" : ""}>
                        {space}
                      </span>
                      <input
                        className="line-space-radio"
                        name="line-space"
                        type="radio"
                        checked={selectedLineSpace === space}
                        onChange={() => setSelectedLineSpace(space)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="separator" />
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
                        minutes < 12 ? "#ff6a16" : minutes < 25 ? "#ffcc16" : "#037101",
                    }}
                  />
                </div>
              </div>
            )}
            <img
              src={paused ? "/icons/play-icon.svg" : "/icons/pause-icon.svg"}
              className="pause-button"
              onClick={togglePause}
              alt="Pause"
            />
          </div>
          <div
            onClick={() => setMenuopen((prev) => !prev)}
            className="notes-tools"
          >
            <img src="/icons/notes-icon.svg" alt="notes" />
          </div>
        </div>
      </div>
      
      <div 
        ref={sidebarRef}
        className={`annotations-section ${menuopen ? 'visible' : ''}`}
      >
        <div
          onClick={() => setMenuopen(false)}
          className="cross-icon"
        >
          <img src="/icons/cross-icon.svg" alt="close" />
        </div>
        <div className="notes-navigation">
          <h2
            onClick={() => setTab(1)}
            className={tab === 1 ? "current" : ""}
          >
            Notes
          </h2>
          <h2
            onClick={() => setTab(2)}
            className={tab === 2 ? "current" : ""}
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
            <div className="editor-container">
  <MenuBar editor={editor} />
  {editor && <EditorContent editor={editor} />}
</div>
          </div>
        </div>
        <div className={`notes-editor explanations ${tab === 2 ? "visible" : ""}`}>
          <div className="video-container">
            <ReactPlayer
              url="https://www.youtube.com/watch?v=zQnBQ4tB3ZA"
              controls={true}
              width="100%"
              height={300}
            />
          </div>
        </div>
        {tab === 1 && (
          <div className="notes-ui">
            <button
              className="save-button"
              onClick={handleSave}
            >
              Save
            </button>
            <div className="checkbox" />
            <span>Share your notes? (Experimental)</span>
            <img src="/icons/question-icon.svg" alt="help" />
          </div>
        )}
      </div>
    </>
  );
};

export default TopBar;