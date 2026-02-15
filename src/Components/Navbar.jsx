import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import DOMAIN from '../constants'

const Navbar = () => {
  const userData = useSelector((store) => store.user)
  const [query, setQuery] = useState("")
  const [foundUsers, setFoundUsers] = useState([])
  // console.log(foundUsers)
  const nav = useNavigate()

  useEffect(() => {

    if (query.length == 0) {
      setFoundUsers([])
    }
    const ID = setTimeout(() => {

      if (query.length > 0) {
        axios.get(DOMAIN + `/profile/search?q=${query}`, { withCredentials: true })
          .then((res) => {
            // console.log(res)
            setFoundUsers(res.data.data)
          })
      }
    }, 1000)

    return () => {
      clearTimeout(ID)
    }

  }, [query])

  return (
    <div className="z-50 h-[10vh] w-full px-4 md:px-8 py-4 glass-nav flex items-center justify-between fixed top-0 transition-all duration-300">

      <h1 className="text-xl md:text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer hover:opacity-80 transition-opacity hidden sm:block">
        TWITTER
      </h1>
      <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 cursor-pointer sm:hidden">
        <i className="fa-brands fa-twitter"></i>
      </h1>

      <div className='relative group flex-1 mx-4 max-w-[400px]'>

        <div className="relative w-full">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            placeholder="Search..."
            className="w-full px-4 md:px-5 py-2 md:py-2.5 pr-10 md:pr-12 rounded-full bg-slate-800/50 text-slate-100 placeholder-slate-400 border border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm text-sm"
          />
          <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-300">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        {foundUsers.length > 0 && (
          <div className="absolute mt-2 w-full max-h-[60vh] overflow-y-auto rounded-xl bg-[#0f172a] border border-slate-700 shadow-2xl z-50 animate-fade-in scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
            {foundUsers.map((item) => {
              return (
                <div
                  key={item._id}
                  onClick={() => {
                    setQuery("")
                    setFoundUsers([])
                    nav(`/profile/${item._id}`)
                  }}
                  className="flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 cursor-pointer hover:bg-slate-800/80 transition-all border-b border-slate-700/50 last:border-none group"
                >
                  <img
                    src={
                      item.profilePicture ||
                      "https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"
                    }
                    alt=""
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-slate-600 group-hover:border-blue-500 transition-colors"
                  />

                  <div className="flex flex-col">
                    <p className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors truncate">
                      {item.firstName + " " + item.lastName}
                    </p>
                    <p className="text-xs text-slate-500 group-hover:text-blue-400 transition-colors">@{item.username}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}


      </div>


      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
          <img
            src={userData.data.profilePicture ||
              "https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"}
            alt="User"
            className="relative w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-slate-900 object-cover"
          />
        </div>
      </div>

    </div>
  )
}

export default Navbar
