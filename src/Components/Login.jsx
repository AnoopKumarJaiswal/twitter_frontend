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
    username: "anoop",
    password: "Anoop123!",
  });


  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit() {
    if(!formData.password || !formData.username || formData.username.length > 20)
    {
      toast.error("Please Enter valid username & password.")
      return
    }

    axios.post(DOMAIN  + "/signin", formData, {withCredentials : true})
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-8">

        {/* Header */}
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Log in to your account
        </h1>

        {/* Login Inputs */}
        <div className="space-y-6">

          {/* Username */}
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-600"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="border-b border-gray-300 py-2 focus:border-blue-500 outline-none text-gray-800"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-600"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="text"
              value={formData.password}
              onChange={handleChange}
              className="border-b border-gray-300 py-2 focus:border-blue-500 outline-none text-gray-800"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-3 rounded-full text-lg font-semibold hover:bg-gray-900 transition"
        >
          Log in
        </button>
        <p className="text-right">Not a user? <span onClick={() => {
            nav("/signup")
        }} className="text-blue-400 cursor-pointer">Register now!</span></p>
      </div>
    </div>
  );
};

export default Login;
