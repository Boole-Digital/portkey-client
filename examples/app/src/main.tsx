import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { BackgroundIframeProvider } from "react-background-iframe";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BackgroundIframeProvider initialSrc="http://localhost:3002">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </BackgroundIframeProvider>
  </StrictMode>
);
