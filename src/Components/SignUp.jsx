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
  const[showPassword, setShowPassword] = useState(false)
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
    if(!formData.firstName || formData.firstName.length < 2 || formData.firstName.length > 15)
    {
        toast.error("First Name should have atleast 2 characters and max 15 characters.")
        return
    }

    if(!formData.lastName || formData.lastName.length < 3 || formData.lastName.length > 15)
    {
        toast.error("Last Name should have atleast 3 characters and max 15 characters.")
        return
    }

    if(!formData.username || formData.username.length > 20)
    {
        toast.error("Username should have atleast 1 characters and max 20 characters.")
        return
    }

    if(!validator.isEmail(formData.email))
    {
        toast.error("Please Enter a valid Email")
        return
    }

    if(!validator.isStrongPassword(formData.password))
    {
        toast.error("Please Enter a strong password")
        return
    }

    if(!formData.dob)
    {
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
        if(e.status == 410)
        {
          nav("/verify")
        }

    })

  }

  return (
  <div className="max-h-screen bg-white flex items-center justify-center p-6">
    <div className="w-full max-w-lg space-y-8">

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
        Create your account
      </h1>

      {/* Input wrapper */}
      <div className="space-y-6">

        {/* First Name */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="text-sm font-semibold text-gray-600">
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            className="border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none py-2 text-gray-800"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="lastName" className="text-sm font-semibold text-gray-600">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none py-2 text-gray-800"
          />
        </div>

        {/* Username */}
        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm font-semibold text-gray-600">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none py-2 text-gray-800"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-semibold text-gray-600">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none py-2 text-gray-800"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-semibold text-gray-600">
            Password
          </label>
          <div className="flex relative">

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className="border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none py-2 text-gray-800 w-full"
          />
        <span onClick={() => {
            setShowPassword(!showPassword)
        }} className="absolute right-0 cursor-pointer">{showPassword ? "🙈" : "👀" } </span>
          </div>

        </div>

        {/* DOB */}
        <div className="flex flex-col">
          <label htmlFor="dob" className="text-sm font-semibold text-gray-600">
            Date of Birth
          </label>
          <input
            max={getTodayDate()}
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className="border-b border-gray-300 focus:border-blue-500 focus:ring-0 outline-none py-2 text-gray-800"
          />
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-3 cursor-pointer rounded-full text-lg font-semibold hover:bg-gray-900 transition"
      >
        Create account
      </button>
        <p className="text-right">Already A User? <span onClick={() => {
          nav("/login")
        }} className="text-blue-400 cursor-pointer">Log In Instead</span> </p>
    </div>
  </div>
);



};

export default SignUp;
