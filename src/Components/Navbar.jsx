import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import DOMAIN from '../constants'

const Navbar = () => {
  const userData = useSelector((store) => store.user)
  const[query, setQuery] = useState("")
  const[foundUsers, setFoundUsers] = useState([])
  // console.log(foundUsers)
  const nav = useNavigate()

  useEffect(() => {

      if(query.length == 0)
      {
        setFoundUsers([])
      }
    const ID = setTimeout(() => {

      if(query.length > 0)
      {
        axios.get(DOMAIN + `/profile/search?q=${query}` , {withCredentials : true})
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
    <div className="z-50 h-[10vh] w-full px-8 py-4 bg-blue-600 text-white flex items-center justify-between shadow-md fixed top-0">
      
      <h1 className="text-2xl font-bold tracking-wide">LOGO</h1>

      <div className='relative'>

        <div className="relative w-[400px]"> 
          <input 
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
            }}
            placeholder="Search Users"
            className="w-full px-4 py-2 pr-10 rounded-xl bg-white text-black placeholder-gray-500 focus:outline-none"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black opacity-70 cursor-pointer">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        {foundUsers.length > 0 && (
          <div className="w-[400px] max-h-[300px] overflow-y-auto absolute mt-2 
                          bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">

            {foundUsers.map((item) => {
              return (
                <div onClick={() => {
                  setFoundUsers([])
                  setQuery("")
                  nav(`/profile/${item._id}`)
                }}
                  key={item._id}
                  className="flex items-center gap-3 px-3 py-2 cursor-pointer 
                            hover:bg-gray-100 transition rounded-lg"
                >
                  <img
                    src={
                      item.profilePicture ||
                      "https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"
                    }
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <p className="font-medium text-gray-900 text-sm">
                      {item.firstName + " " + item.lastName}
                    </p>
                    <p className="text-xs text-gray-500">@{item.username}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}


      </div>


      {/* Right Section */}
      <div className="flex items-center gap-6">
        <img 
          src={userData.data.profilePicture || 
          "https://cdn.vectorstock.com/i/750p/92/16/default-profile-picture-avatar-user-icon-vector-46389216.avif"} 
          alt="User"
          className="w-12 h-12 rounded-full border-2 border-white object-cover cursor-pointer hover:scale-105 transition"
        />
      </div>

    </div>
  )
}

export default Navbar
