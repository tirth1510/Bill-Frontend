import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // global styles
import { AuthProvider } from "./context/authcontext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = "248488594338-dj46dqfrollrm3m06sfr4ee0fdf1b87d.apps.googleusercontent.com"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
