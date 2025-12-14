import React, { useEffect, useRef, useState } from 'react'
import { useUtilContext } from '../utils/UtilContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addPost } from '../utils/userSlice'
import DOMAIN from '../constants'


const NewPost = ({ name }) => {
  const inputRef = useRef()
  const [file, setFile] = useState()
  const [tempUrl, setTempUrl] = useState("")
  const { showSidebar, setShowSidebar } = useUtilContext()
  const [showBtn, setShowBtn] = useState(true)
  const [postDetails, setPostDetails] = useState({
    caption : "",
    img : ""
  })
//   console.log(postDetails)
  const nav = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (file) {
      setShowBtn(false)
      const url = URL.createObjectURL(file)
      setTempUrl(url)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESETS)

      axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`, formData)
      .then((res) => {
        // console.log(res)
        setPostDetails(prev => ({
            ...prev, img : res.data.url
        }))
        setShowBtn(true)
      })
      .catch((error) => {
        console.log(error)
      })


    }
  }, [file])

  return (
    <div className={
      'bg-gray-100 flex justify-center items-start py-10 transition-all duration-300 ' +
      (showSidebar ? "w-[80vw]" : "w-[95vw]")
    }>

      {/* CARD */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-[35vw] min-h-[50vh] flex flex-col gap-6">

        {/* IMAGE UPLOADER */}
        <div className="relative border-2 border-dashed border-gray-300 rounded-xl w-full h-[35vh] overflow-hidden flex items-center justify-center cursor-pointer hover:border-gray-400 transition">

          <input
            onChange={(e) => setFile(e.target.files[0])}
            ref={inputRef}
            className="hidden"
            type="file"
          />

          <img
            className="w-full h-full object-cover rounded-xl"
            onClick={() => inputRef.current.click()}
            src={tempUrl || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQ4AAACUCAMAAABV5TcGAAAAMFBMVEXp7vG6vsHW297s8fS2ur3k6ezFys3P09bg5OfAxcfa3+LJztC9wcTM0NPDx8rv9Pf/nYWfAAADtklEQVR4nO2djZaCIBBGVUAQf3j/t101K1FEM3EZ+u7Zs6dTJnmbGRXEsgwAAAAAAAAAAAAAAAAAAAAAAOjBQvPfG/gB/YcVoelb+e/NPAgTWpahqaUmIYQxXTb5DTStit8Hy4pbZAx0On4fxV0y8pxXsccHUxW/0Uct4vYh2htt9PWj+O8N9sLUs3DwwEzNlHGHx7NyVK0MSj1pb+KupnKyoUM39PQesw426eDBY/iVlTEXjzt1VNAxawk6rJagw2qJtA5mGDPGXNgSYR1GFHXVVZ1Ul3Xb0NUxPDkeRfbHkp2+KELI6jCqmZ3G8NJcEiBUdZjFCT+vLvFBVAdT+QJe/7CObN01xosL6gdNHczVN9ZcEB40dYjOoSMvvvdBUgfTrm7kfu/yfUskdUhXcOTNvg6m9l6nqKN16sh3V2QUr/0tpaRD7KzHqGGH7G0pJR17qxm7urj0VFyaOtxjUM3OWqaOPy59y1DUoZwDlLW3lM4GJ7bzhaSOTJQuHd7e77nCbR80dTizpfOuQlezRTfzhaiOzBEevnFm28bow7k0TR3vj/1GeirH+jB2I1+I6sjM4uvOpaeD0FV6ex+ON1DV0X/web5UvtM3pl1nfM58Iatj6Djupi+9apWnL8xtw+2Dro6MGaFlW9ZtoZi3bqzKzHa+ENbxuMp0/O9776aN8Sqf5dKUdRxhI1NePhbjWInr8MSGy0fiOnZsrHykrWPXRo/lI2UdW3tYj49UdDDHMcSR2Fj4SEQHU6tjqsM25j7S0DFclLzwcTBTHqxPDSnrMKrjed5aPj6x8Y6PFHT0NsaX5z6OZ4oVHwnoePd9yNfLzmE6L0UiOph4T2aY4sM9aPkTOh5148lYTz/Yp6Smo48Na6vazJyJjUR0MLXcgcgTdSMVHY4e5KY+kSlp6DCr2DgPfR1GnAuENHU4MuWHdayr6C/ruLJu0Ndxad0gr+PaukFdx/U2SOs4c1KSrg4WYAo6YR1m48rBH9WxdSEldEAHdKB2zEF0WECHBXRYoHZYhD8q5ZR1ZEqr4U+p9YPlE0eXfFw0R1NHuJagw2oJOqyWoMNqCTqslijoeN1GrduZFfw1r+HuuHU8J3vVj11jMPRzVkjMd5U7df3KN0R+x1Imyltv0Jl7ptpGwX239h2oos6VITwCnLVtE3twLKa+BYXnbdw3bx3o4+OmfGk25tjGBcuKugtupOna6+5RFxSWCaWLwGhFITQmgv/iBK0fnQAAAAAAAAAAAAAAAAAAAAAAgIk/8RBCgdmc+LIAAAAASUVORK5CYII="}
            alt=""
          />

          {/* REMOVE BUTTON */}
          <i
            onClick={() => setTempUrl("")}
            className="fa-solid fa-xmark absolute top-2 right-2 p-2 rounded-full cursor-pointer text-black"
          ></i>
        </div>

        {/* TEXTAREA */}
        <textarea
          onChange={(e) => {
            setPostDetails(prev => ({
                ...prev, caption : e.target.value
            }))
          }}
          placeholder="Write a caption..."
          className="w-full h-[18vh] p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none text-gray-700"
        ></textarea>

        {showBtn && <button
        onClick={() => {
            if(!postDetails.img && !postDetails.caption)
            {
                toast.error("Please enter atleast one field")
                return
            }
            axios.post(DOMAIN + "/posts", postDetails, {withCredentials : true})
            .then((res) => {
                // console.log(res)
                dispatch(addPost(res.data.data))
                nav("/profile")
            })
        }}
        className="px-6 py-3 border border-gray-600 text-gray-800 rounded-xl
                    hover:bg-gray-100 active:scale-95 transition-all duration-200"
        >
        Add Post
        </button>}


      </div>

    </div>
  )
}

export default NewPost
