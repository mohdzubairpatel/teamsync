import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";

console.log("API URL:", import.meta.env.VITE_API_URL);

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <AuthProvider>
      <App />
    </AuthProvider>

  </React.StrictMode>
);