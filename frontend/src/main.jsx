import React from "react";
import { createRoot } from "react-dom/client";
import App from "../App";
import "./style.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import "./styles/home.css";
import "./styles/navbar.css";

const container = document.getElementById("root");

createRoot(container).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
