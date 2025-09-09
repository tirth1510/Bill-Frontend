import { useState, useRef } from "react";
import "./pin.css";

export default function Pin() {
  const [pin, setPin] = useState(Array(6).fill(""));
  const [toast, setToast] = useState<string | null>(null);
  const [forgotRequested, setForgotRequested] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const clearAll = () => {
    setPin(Array(6).fill(""));
    inputsRef.current[0]?.focus();
  };

  const verifyMPIN = () => {
    if (pin.join("").length < 6) {
      showToast("Please enter all 6 digits");
    } else {
      showToast("✅ MPIN Verified Successfully!");
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const sendForgotRequest = async () => {
    showToast("📩 Reset request sent successfully!");
    setTimeout(() => {
      setForgotRequested(true);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-screen">
      <div className="mpin-card w-full max-w-md p-8 relative z-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        {/* Back Button (only "Back") */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back
          </button>
        </div>

        {!forgotRequested ? (
          <>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                <i className="fas fa-shield-alt text-white text-3xl"></i>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Secure Access
              </h1>
              <p className="text-gray-600">Enter your 6-digit MPIN to continue</p>
            </div>

            {/* PIN Inputs */}
            <div className="mb-8">
              <div className="flex justify-center text-black space-x-3 mb-6">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputsRef.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="pin-input w-10 h-12 text-center border rounded-lg text-lg"
                  />
                ))}
              </div>

              <div className="text-center mb-4">
                <button
                  onClick={clearAll}
                  className="btn-clear text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  <i className="fas fa-times-circle mr-1"></i>
                  Clear All
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={sendForgotRequest}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <i className="fas fa-question-circle mr-1"></i>
                  Forgot MPIN?
                </button>
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={verifyMPIN}
              className="btn-verify w-full py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-600 to-blue-600 focus:outline-none mb-6"
            >
              Verify MPIN
              <i className="fas fa-check-circle ml-2"></i>
            </button>
          </>
        ) : (
          /* Forgot MPIN Form */
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Reset Your MPIN
            </h2>
            <p className="text-sm text-gray-600">
              Enter your email and new MPIN to reset securely.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="password"
              placeholder="Enter new MPIN"
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="password"
              placeholder="Confirm new MPIN"
              className="w-full border p-2 rounded-lg"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
              Submit New MPIN
            </button>
          </div>
        )}

        {/* Security Info */}
        <div className="p-4 mt-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <i className="fas fa-shield-check text-blue-500 mr-3 text-lg"></i>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Enhanced Security
              </p>
              <p className="text-xs text-blue-600">
                Your MPIN adds an extra layer of protection to your account
              </p>
            </div>
          </div>
        </div>

        {/* Keyboard Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            <i className="fas fa-keyboard mr-1"></i>
            Use keyboard to enter digits
          </p>
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50">
          <div className="flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
