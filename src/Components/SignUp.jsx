import React, { useState } from "react";
import toast from "react-hot-toast"
import validator from "validator"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import DOMAIN from "../constants";


function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear() - 18;
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  // console.log(`${year}-${month}-${day}`)
  return `${year}-${month}-${day}`;
}


const SignUp = () => {
  const nav = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    dob: "",
  });



  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit() {
    if (!formData.firstName || formData.firstName.length < 2 || formData.firstName.length > 15) {
      toast.error("First Name should have atleast 2 characters and max 15 characters.")
      return
    }

    if (!formData.lastName || formData.lastName.length < 3 || formData.lastName.length > 15) {
      toast.error("Last Name should have atleast 3 characters and max 15 characters.")
      return
    }

    if (!formData.username || formData.username.length > 20) {
      toast.error("Username should have atleast 1 characters and max 20 characters.")
      return
    }

    if (!validator.isEmail(formData.email)) {
      toast.error("Please Enter a valid Email")
      return
    }

    if (!validator.isStrongPassword(formData.password)) {
      toast.error("Please Enter a strong password")
      return
    }

    if (!formData.dob) {
      toast.error("Please Enter date of birth")
      return
    }


    axios.post(DOMAIN + "/signup", {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      mail: formData.email,
      password: formData.password,
      dateOfBirth: formData.dob,
    })
      .then(() => {
        toast.success("User Registered")
        nav("/login")
      })
      .catch((e) => {

        toast.error(e.response.data.error)
        if (e.status == 410) {
          nav("/verify")
        }

      })

  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden py-10 transition-colors duration-500">
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>

      <div className="w-full max-w-2xl p-8 rounded-2xl glass-card relative z-10 animate-slide-in border border-slate-700/50 shadow-2xl shadow-black/50 my-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-slate-400 text-sm">Join the conversation today</p>
        </div>

        {/* Input wrapper */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* First Name */}
          <div className="group">
            <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-blue-400">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-600"
            />
          </div>

          {/* Last Name */}
          <div className="group">
            <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-blue-400">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-600"
            />
          </div>

          {/* Username */}
          <div className="group md:col-span-2">
            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-purple-400">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">@</span>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all duration-300 placeholder-slate-600"
              />
            </div>
          </div>

          {/* Email */}
          <div className="group md:col-span-2">
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-blue-400">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-600"
            />
          </div>

          {/* Password */}
          <div className="group md:col-span-2">
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-purple-400">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all duration-300 placeholder-slate-600"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-white transition-colors"
              >
                {showPassword ? "🙈" : "👀"}
              </span>
            </div>
          </div>

          {/* DOB */}
          <div className="group md:col-span-2">
            <label htmlFor="dob" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-blue-400">
              Date of Birth
            </label>
            <input
              max={getTodayDate()}
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-600 [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
        >
          <span className="relative z-10">Create Account</span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </button>

        <p className="text-center mt-6 text-slate-400 text-sm">
          Already a user?
          <span onClick={() => nav("/login")} className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 ml-1 transition-colors hover:underline decoration-blue-500/30">
            Log In Instead
          </span>
        </p>
      </div>
    </div>
  );



};

export default SignUp;
