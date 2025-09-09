import React, { useEffect } from "react";
import GoogleLoginButton from "./google";

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  id: string;
  exp: number;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) return; // no token → stay on login

    try {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        // token valid → redirect to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // token expired → remove cookie
        Cookies.remove("accessToken");
      }
    } catch (err) {
      console.error("Invalid token", err);
      Cookies.remove("accessToken");
    }
  }, [navigate]);

  useEffect(() => {
    const particlesContainer = document.getElementById("particles");
    if (particlesContainer) {
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        const size = Math.random() * 8 + 2;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesContainer.appendChild(particle);
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center p-4 min-h-screen bg-gradient-to-br from-indigo-400 to-purple-500 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="waves-container">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <div className="particles" id="particles"></div>

      <div className="login-card w-full max-w-md p-8 relative z-10 bg-white dark:bg-gray-900 dark:bg-opacity-95 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-800 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
            <i className="fas fa-receipt text-white text-3xl ">hi</i>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Billing System
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Streamline your billing operations
          </p>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleLoginButton />

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors dark:text-blue-400 dark:hover:text-blue-300"
            >
              Contact admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
