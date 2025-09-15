import  { useEffect } from "react";
import GoogleLoginButton from "./google";

export default function Login() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-blue-100 relative p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl h-[700px] md:h-[600px] bg-white/90 dark:bg-gray-900 dark:bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 relative  bg-blue-50 flex items-center justify-center">
          <div className="w-80 h-80 mx-auto">
            <img src="/image.png" alt="Preview" className="object-contain w-800 h-full" />
            <div className="absolute bottom-0 left-0 w-full h-65 bg-gradient-to-t from-blue-200 to-transparent"></div>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 relative z-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-50 to-blue-500 bg-clip-text text-transparent pb-5">
             I MATA
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
               Billing System
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
              Don&apos;t have an account?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition-colors dark:text-blue-400 dark:hover:text-blue-300">
                Contact admin
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="particles absolute inset-0" id="particles"></div>

      <style>{`
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          animation-name: floatParticle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes floatParticle {
          0% { transform: translateY(0); }
          50% { transform: translateY(-50px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}