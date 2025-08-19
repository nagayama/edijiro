import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./monaco-worker";

const root = ReactDOM.createRoot(document.getElementById("root")!);

// Disable StrictMode in development to avoid Monaco Editor dispose issues
if (import.meta.env.PROD) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  root.render(<App />);
}

// Use contextBridge
window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
