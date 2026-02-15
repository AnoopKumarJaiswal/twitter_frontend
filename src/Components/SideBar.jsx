import React from 'react'
import { Link } from 'react-router-dom'
import { useUtilContext } from '../utils/UtilContext.jsx'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../utils/userSlice.js'
import DOMAIN from '../constants.js'

const SideBar = () => {
  const { showSidebar, setShowSidebar } = useUtilContext()
  const dispatch = useDispatch()

  return (
    <div
      onMouseLeave={() => setShowSidebar(false)}
      onMouseEnter={() => setShowSidebar(true)}
      className={`
        bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/50
        min-h-[90vh]
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
        flex flex-col
        justify-between
        py-8
        h-full
        shadow-2xl shadow-blue-900/5
        ${showSidebar ? "w-[20vw] px-6" : "w-[80px] items-center px-4"}
      `}
    >
      {/* TOP MENU */}
      <div className="flex flex-col gap-6 w-full">
        {/* HOME */}
        <Link to="/home" className="flex items-center gap-4 text-slate-400 hover:text-blue-400 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-blue-500/10 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 group w-full overflow-hidden whitespace-nowrap">
          <i className="fa-regular fa-house text-xl w-6 text-center group-hover:scale-110 transition-transform duration-300"></i>
          <span className={`font-medium tracking-wide transition-opacity duration-300 ${showSidebar ? "opacity-100 delay-100" : "opacity-0 invisible w-0"}`}>
            Home
          </span>
        </Link>

        {/* PROFILE */}
        <Link to="/profile" className="flex items-center gap-4 text-slate-400 hover:text-purple-400 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-purple-500/10 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 group w-full overflow-hidden whitespace-nowrap">
          <i className="fa-solid fa-user text-xl w-6 text-center group-hover:scale-110 transition-transform duration-300"></i>
          <span className={`font-medium tracking-wide transition-opacity duration-300 ${showSidebar ? "opacity-100 delay-100" : "opacity-0 invisible w-0"}`}>
            Profile
          </span>
        </Link>


        {/* ADD POST */}
        <Link to="/post" className="flex items-center gap-4 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-emerald-500/10 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 group w-full overflow-hidden whitespace-nowrap mt-4 border border-transparent hover:border-emerald-500/20">
          <i className="fa-solid fa-plus text-xl w-6 text-center group-hover:rotate-90 transition-transform duration-300"></i>
          <span className={`font-medium tracking-wide transition-opacity duration-300 ${showSidebar ? "opacity-100 delay-100" : "opacity-0 invisible w-0"}`}>
            Add Post
          </span>
        </Link>
      </div>

      {/* LOGOUT */}
      <div
        onClick={() => {
          axios
            .post(DOMAIN + '/signout', {}, { withCredentials: true })
            .then(() => {
              dispatch(logoutUser())
            })
        }}
        className="flex items-center gap-4 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-red-500/10 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 group w-full overflow-hidden whitespace-nowrap"
      >
        <i className="fa-solid fa-power-off text-xl w-6 text-center group-hover:scale-110 transition-transform duration-300"></i>
        <span className={`font-medium tracking-wide transition-opacity duration-300 ${showSidebar ? "opacity-100 delay-100" : "opacity-0 invisible w-0"}`}>
          Logout
        </span>
      </div>
    </div>
  )
}

export default SideBar
