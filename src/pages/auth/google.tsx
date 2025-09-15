import React, { useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner"; // <-- import toast

const GoogleLoginButton: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) return;

      setLoading(true);

      const res = await axios.post(
        `https://bill-backend-j5en.onrender.com/auth/google-login`,
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );

      console.log("Login success:", res.data);

      setUser(res.data.user);
      toast.success("Logged in successfully!"); // <-- show success toast

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      toast.error(err?.response?.data?.message || "Login failed!"); // <-- show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {loading ? (
        <button
          disabled
          className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 flex items-center gap-2"
        >
          <svg
            className="animate-spin h-5 w-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          Logging in...
        </button>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log("Google Login Failed");
            toast.error("Google Login Failed"); // <-- toast on error
          }}
          text="continue_with"
          shape="pill"
          size="large"
          width={300}
          logo_alignment="left"
          useOneTap
        />
      )}
    </div>
  );
};

export default GoogleLoginButton;
