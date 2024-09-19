import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import "./assets/base.css";
import "./assets/index.css";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
