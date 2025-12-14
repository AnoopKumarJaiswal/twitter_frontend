import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import DOMAIN from "../constants"


const EditProfile = () => {
  const userObj = useSelector(store => store.user)
  const { firstName, lastName, profilePicture, bio } = userObj.data
  const [img, setImg] = useState(null)
  const [tempUrl, setTempUrl] = useState("")
  const [details, setDetails] = useState({
    profilePicture,
    firstName,
    lastName,
    bio
  })
  // console.log(details)
  const dispatch = useDispatch()
  const nav = useNavigate()

  const ipRef = useRef()

  useEffect(() => {
    if (img) {
      let temp = URL.createObjectURL(img)
      // console.log(temp)
      setTempUrl(temp)

      const fd = new FormData()
      fd.append("file", img)
      fd.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESETS)

      async function uploadToCloud()
      {
        const res = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, fd)
        // console.log(res)
        setDetails(prev => ({
          ...prev,
          profilePicture : res.data.url
        }))
      }
      uploadToCloud()
  


    }
  }, [img])

  return (
    <div className="w-full max-w-xl mx-auto p-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Edit Profile
      </h2>

      <div className="space-y-6">


     

        {/* Profile Image */}
        <div className="flex justify-center">
          <img
            onClick={() => ipRef.current.click()}
            src={tempUrl || details.profilePicture || "https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 shadow hover:opacity-80 cursor-pointer transition"
            alt="profile preview"
          />
        </div>

        <input
          ref={ipRef}
          className="hidden"
          onChange={(e) => setImg(e.target.files[0])}
          type="file"
        />

        {/* First Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">First Name</label>
          <input
            value={details.firstName}
            onChange={(e) => {
              setDetails(prev => ({
                ...prev,
                firstName : e.target.value
              }))
            }}
            type="text"
            className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter first name"
            name="firstName"
          />
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Last Name</label>
          <input
            value={details.lastName}
            onChange={(e) => {
              setDetails(prev => ({
                ...prev,
                lastName : e.target.value
              }))
            }}
            type="text"
            className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter last name"
            name="lastName"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Bio</label>
          <textarea
            value={details.bio}
            rows="3"
            onChange={(e) => {
              setDetails(prev => ({
                ...prev,
                bio : e.target.value
              }))
            }}
            className="w-full p-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            placeholder="Write something about yourself..."
            name="bio"
          ></textarea>
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={() => {
            axios.patch(DOMAIN + "/profile/edit", details, {withCredentials : true})
            .then((data) => {
              // console.log(data)
              dispatch(addUser(data.data.data))
              nav("/profile")
            })
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition"
        >
          Save Changes
        </button>

      </div>
    </div>
  );
};

export default EditProfile;
