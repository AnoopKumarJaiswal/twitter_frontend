import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import DOMAIN from "../constants";


const Login = () => {
  const dispatch = useDispatch()
  const nav = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [show, setShow] = useState(false)


  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit() {
    if (!formData.password || !formData.username || formData.username.length > 20) {
      toast.error("Please Enter valid username & password.")
      return
    }

    axios.post(DOMAIN + "/signin", formData, { withCredentials: true })
      .then((data) => {
        dispatch(addUser(data.data.data))
        toast.success("Logged In")
        nav("/home")
      })
      .catch((error) => {
        console.log(error);

        toast.error("Invalid Credentials")
      })


  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden transition-colors duration-500">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-md p-8 rounded-2xl glass-card relative z-10 animate-slide-in border border-slate-700/50 shadow-2xl shadow-black/50">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-sm">Log in to continue your journey</p>
        </div>

        {/* Login Inputs */}
        <div className="space-y-6">

          {/* Username */}
          <div className="group">
            <label
              htmlFor="username"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-blue-400"
            >
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-600"
                placeholder="Enter your username"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-purple-400"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={show ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all duration-300 placeholder-slate-600"
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-500 hover:text-purple-400 transition-colors">
                {show ?
                  <i className="fa-solid fa-eye-slash" onClick={() => setShow(false)}></i> :
                  <i className="fa-solid fa-eye" onClick={() => setShow(true)}></i>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
        >
          <span className="relative z-10">Log in</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Not a user?
          <span
            onClick={() => nav("/signup")}
            className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 ml-1 transition-colors hover:underline decoration-blue-500/30"
          >
            Register now!
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
