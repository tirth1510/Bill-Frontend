import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ReactQueryProvider from "@/providers/googleprovider"; // adjust path if different
import "./index.css"; // global styles
import { AuthProvider } from "./context/authcontext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReactQueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ReactQueryProvider>
  </React.StrictMode>
);
