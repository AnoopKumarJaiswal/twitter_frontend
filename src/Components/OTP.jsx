import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import validator from "validator";
import DOMAIN from "../constants";
import { useNavigate } from "react-router-dom";

const OTP = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [mail, setMail] = useState("");

  // ✅ CORRECT WAY TO STORE REFS
  const arrOfRefs = useRef([]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const navigate = useNavigate();

  // 🔥 AUTO FOCUS LOGIC
  useEffect(() => {
    if (isOtpSent && currentIdx < 6) {
      arrOfRefs.current[currentIdx]?.focus();
    }
  }, [isOtpSent, currentIdx]);

  // 🔥 KEYBOARD NAVIGATION
  useEffect(() => {
    function something(e) {
      if (e.key === "ArrowLeft" && currentIdx > 0) {
        setCurrentIdx(prev => prev - 1);
      }

      if (e.key === "ArrowRight" && currentIdx < 5) {
        setCurrentIdx(prev => prev + 1);
      }

      if (e.key === "Backspace" && currentIdx > 0 && !otp[currentIdx]) {
        setCurrentIdx(prev => prev - 1);
      }
    }

    if (isOtpSent) {
      window.addEventListener("keydown", something);
    }

    return () => window.removeEventListener("keydown", something);
  }, [currentIdx, isOtpSent, otp]);

  return (
    <div className="flex h-screen w-full bg-[#0f172a] justify-center items-center relative overflow-hidden transition-colors duration-500">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      {/* OTP SCREEN */}
      {isOtpSent && (
        <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10 animate-slide-in border border-slate-700/50 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
              Enter Verification Code
            </h1>
            <p className="text-slate-400 text-sm">
              We've sent a code to <span className="text-blue-400 font-semibold">{mail}</span>
            </p>
          </div>

          <div className="flex justify-center gap-3 mb-8">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <input
                  key={i}
                  ref={(el) => (arrOfRefs.current[i] = el)}
                  type="text"
                  maxLength={1}
                  value={otp[i]}
                  className="w-12 h-14 bg-slate-900/50 border border-slate-700 rounded-xl text-center text-2xl font-bold text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all duration-300 placeholder-slate-600 caret-blue-500"
                  onChange={(e) => {
                    const value = e.target.value;

                    // allow only numbers
                    if (!/^[0-9]?$/.test(value)) return;

                    // ✅ correct state update
                    setOtp(prev => {
                      const newOtp = [...prev];
                      newOtp[i] = value;
                      return newOtp;
                    });

                    // move to next input
                    if (value && i < 5) {
                      setCurrentIdx(i + 1);
                    }
                  }}
                />
              ))}
          </div>

          <button
            onClick={() => {
              axios.post(DOMAIN + "/otp/verify-otp", { mail, otp: otp.join("") })
                .then(() => {
                  toast.success("OTP Verified");
                  setIsOtpSent(false);
                  navigate("/signup")
                })
                .catch(() => {
                  toast.error("Invalid OTP");
                })
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group">
            <span className="relative z-10">Verify & Proceed</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <p className="text-center mt-6 text-slate-500 text-sm">
            Didn't receive the code?
            <span
              onClick={() => setIsOtpSent(false)}
              className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 ml-1 transition-colors hover:underline decoration-blue-500/30"
            >
              Resend
            </span>
          </p>
        </div>
      )}

      {/* EMAIL SCREEN */}
      {!isOtpSent && (
        <div className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10 animate-fade-in border border-slate-700/50 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <i className="fa-regular fa-envelope text-3xl text-blue-400"></i>
            </div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
              Verify Email
            </h1>
            <p className="text-slate-400 text-sm">Enter your email address to receive a verification code</p>
          </div>

          <div className="group mb-6">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-blue-400">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                <i className="fa-solid fa-at"></i>
              </span>
              <input
                onChange={(e) => setMail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-10 pr-4 py-3.5 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-600"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!validator.isEmail(mail)) {
                toast.error("Invalid Email");
                return;
              }

              const promise = axios.post(DOMAIN + "/otp/send-otp", { mail });

              toast.promise(promise, {
                loading: 'Sending Verification Code...',
                success: () => {
                  setIsOtpSent(true);
                  return <b>Code Sent Successfully!</b>
                },
                error: <b>Failed to send code. Try again.</b>,
              });
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Send Verification Code</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>

          <p className="text-center mt-6 text-slate-500 text-sm">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 ml-1 transition-colors hover:underline decoration-blue-500/30"
            >
              Log in
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default OTP;
