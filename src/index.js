import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Create root element
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render App inside StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
