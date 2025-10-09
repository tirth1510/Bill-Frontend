import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // global styles
import { AuthProvider } from "./context/authcontext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";

const clientId = "42299733053-0vvhi1j4qk1ma0jc8cqg0p9l0k0mi8os.apps.googleusercontent.com"
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
