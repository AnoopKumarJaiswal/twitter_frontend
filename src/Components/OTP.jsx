import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import validator from "validator"
import DOMAIN from "../constants";


const OTP = () => {
    const[isOtpSent, setIsOtpSent] = useState(false)
    const[mail, setMail] = useState("")
    const arrOfRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()]
    const [currentIdx, setCurrentIdx] = useState(0)
    const[otp, setOtp] = useState(new Array(6).fill(""))
    console.log(otp)

    useEffect(() => {
      if(isOtpSent && currentIdx < 6)
      {
        arrOfRefs[currentIdx].current.focus()
      }
    }, [isOtpSent, currentIdx])


    useEffect(() => {

      function something(e)
      {
        if(e.key == "ArrowLeft" && currentIdx > 0 )
        {
          setCurrentIdx(prev => prev - 1)
        }
        if(e.key == "ArrowRight" && currentIdx < 5)
        {
          setCurrentIdx(prev => prev + 1)
        }
        if(e.key == "Backspace")
        {
          setCurrentIdx(prev => prev - 1)
        }
      }
      if(isOtpSent)
      {
        window.addEventListener("keydown", something)

      }

      return () => {
        window.removeEventListener("keydown", something)
      }

    }, [currentIdx, isOtpSent])

  return (
    <div className="flex h-screen bg-blue-200 justify-center items-center">
    {isOtpSent && <div className="bg-white shadow-xl rounded-2xl p-8 ">
        <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Enter OTP
        </h1>

        <div className="flex justify-between gap-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <input
              onChange={(e) => {
                let val = Number(e.target.value)
                if(isNaN(val))
                {
                  return
                }
                setCurrentIdx(currentIdx + 1)
                let temp = otp
                temp[i] = e.target.value
                setOtp(temp)
              }}
              value={otp[i]}
                ref={arrOfRefs[i]}
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
        </div>

        <button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 rounded-xl text-lg font-medium">
          Verify
        </button>
      </div>}


    {!isOtpSent && (
  <div className="bg-white shadow-xl rounded-2xl p-8 w-[350px]">
    <h1 className="text-2xl font-semibold text-gray-700 text-center mb-6">
      Verify Email
    </h1>

    <input
        onChange={(e) => {
            setMail(e.target.value)
        }}
      type="text"
      placeholder="Enter your email"
      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button onClick={() => {
        if(!validator.isEmail(mail))
        {
            toast.error("Invalid Email")
            return
        }
        axios.post(DOMAIN + "/otp/send-otp", {mail})
        .then(() => {
            setIsOtpSent(true)
        })
    }} className="w-full mt-5 bg-blue-600 hover:bg-blue-700 transition-all text-white py-2 rounded-xl text-lg font-medium">
      Send OTP
    </button>
  </div>
)}



    </div>
  );
};

export default OTP;
