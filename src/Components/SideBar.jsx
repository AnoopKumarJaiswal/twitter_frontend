import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUtilContext } from '../utils/UtilContext.jsx'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../utils/userSlice.js'
import DOMAIN from '../constants.js'


const SideBar = () => {
    // const[showSidebar, setShowsidebar] = useState(false)
    const{showSidebar, setShowSidebar} = useUtilContext()
    const dispatch = useDispatch()
  return (
    <div
  onMouseLeave={() => setShowSidebar(false)}
  onMouseEnter={() => setShowSidebar(true)}
  className={`
    bg-blue-300 
    min-h-[90vh]
    transition-all duration-300 
    flex flex-col
    justify-between
    py-6
    fixed
    ${showSidebar ? "w-[20vw] px-4" : "w-[5vw] items-center px-2"}
  `}
>
<div>

  {/* MENU ITEM */}
  <div className="flex items-center gap-3 text-white text-lg hover:text-blue-900 cursor-pointer transition-all">
    <i className="fa-solid fa-user"></i>
    {showSidebar && (
      <Link className="opacity-100 transition-opacity duration-300" to="/profile">
        Profile
      </Link>
    )}
  </div>

  {/* MENU ITEM */}
  <div className="flex items-center gap-3 text-white text-lg hover:text-blue-900 cursor-pointer transition-all mt-4">
    <i className="fa-solid fa-plus"></i>
    {showSidebar && (
      <Link className="opacity-100 transition-opacity duration-300" to="/post">
        Add Post
      </Link>
    )}
  </div>
</div>


    
      <div onClick={() => {
        axios.post(DOMAIN + "/signout", {}, {withCredentials : true})
        .then(() => {
          dispatch(logoutUser())
        })
      }} className='flex items-center gap-3 text-white text-lg hover:text-blue-900 cursor-pointer transition-all mt-4'>
        <i className="fa-solid fa-power-off"></i>{showSidebar && <div>Logout</div>}
      </div>
    
</div>

  )
}

export default SideBar