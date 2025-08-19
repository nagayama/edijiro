import React, { useEffect } from "react";
import "./App.css";
import { Editor } from "./components/Editor";
import { Preferences } from "./components/Preferences";
import { usePersistedStore, useMemoryStore } from "./store/useStore";
import { languages } from "./lib/languages";
import "./lib/theme/themes";

function App() {
  const persistedState = usePersistedStore();
  const memoryState = useMemoryStore();
  const setPersistedState = usePersistedStore.setState;
  const setMemoryState = useMemoryStore.setState;

  const toggleAlwaysOnTop = () => {
    const newValue = !memoryState.alwaysOnTop;
    setMemoryState({ alwaysOnTop: newValue });
    window.ipcRenderer.send("alwaysOnTop", newValue);
  };

  const changeAlwaysOnTop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setMemoryState({ alwaysOnTop: newValue });
    window.ipcRenderer.send("alwaysOnTop", newValue);
  };

  return (
    <div
      id="app"
      className={`theme-${persistedState.theme}`}
      style={{ height: "100%" }}
    >
      <div className="draggable-title-bar"></div>
      <div className="main">
        <div className="editor-wrapper">
          <Editor />
        </div>
      </div>
      <div className="nav-bar">
        <div className="nav-bar-left">
          <div className="nav-bar-item">
            Characters: {memoryState.textLength}
          </div>
          <div className="nav-bar-item">Lines: {memoryState.lineCount}</div>
        </div>
        <div className="nav-bar-right">
          <div className="nav-bar-item nav-bar-item-select">
            <select
              value={persistedState.language}
              onChange={(e) => setPersistedState({ language: e.target.value })}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.text}
                </option>
              ))}
            </select>
          </div>
          <div className="nav-bar-item nav-bar-item-checkbox">
            <span onClick={toggleAlwaysOnTop}>Always on top:</span>
            <div className="pretty p-default p-curve">
              <input
                type="checkbox"
                id="checkbox"
                checked={memoryState.alwaysOnTop}
                onChange={changeAlwaysOnTop}
              />
              <div className="state">
                <label htmlFor="checkbox"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Preferences />
    </div>
  );
}

export default App;
