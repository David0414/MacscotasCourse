import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initMetaPixel } from "./lib/tracking";

initMetaPixel(import.meta.env.VITE_META_PIXEL_ID);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
