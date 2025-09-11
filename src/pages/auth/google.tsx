import React from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate(); // <-- useNavigate instead of useRouter

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        console.error("No credential received");
        return;
      }

      const res = await axios.post(
        `${process.env.VITE_FRONTEND_LIVE_URL}/auth/google-login`,
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      console.log("Login success:", res.data);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        text="continue_with"
        shape="pill"
        size="large"
        width={300}
        logo_alignment="left"
        useOneTap
      />
    </div>
  );
};

export default GoogleLoginButton;
