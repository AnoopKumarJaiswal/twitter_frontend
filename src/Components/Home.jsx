import React, { useEffect, useRef, useState } from 'react'
import Navbar from './Navbar'
import DOMAIN from '../constants'
import axios from 'axios'
import Post from './Post'
import Loader from './Loder'
import { useSelector } from 'react-redux'

const Home = () => {
  const [pageNum, setPageNum] = useState(1)
  const [postCount, setPostCount] = useState(2)
  const [posts, setPosts] = useState([])
  const loderRef = useRef()
  const [intialRender, setInitialRender] = useState(true)
  const [flag, setflag] = useState(false)

  const userData = useSelector(store => store.user.data)



  // 🔹 API call (unchanged)
  useEffect(() => {
    axios
      .get(
        DOMAIN + `/profile/feed?pageNum=${pageNum}&postCount=${postCount}`,
        { withCredentials: true }
      )
      .then((res) => {
        if (posts.length + res.data.data.length >= res.data.totalPosts) {
          setflag(true)
        }
        else {
          setPosts((prev) => [...prev, ...res.data.data])
        }
        setInitialRender(false)
      })
  }, [pageNum])

  // 🔹 Intersection Observer (same logic, fixed placement)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !flag) {
          setPageNum((prev) => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (loderRef.current) {
      observer.observe(loderRef.current)
    }

    return () => observer.disconnect()
  }, [intialRender, flag])

  return (
    <div className="w-full max-w-2xl mx-auto pb-20">
      <div className="mx-auto">
        {posts.length == 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <i className="fa-regular fa-folder-open text-3xl text-slate-500"></i>
            </div>
            <h1 className="text-2xl font-bold text-slate-200 mb-2">No Posts Found</h1>
            <p className="text-slate-500">Follow more people to see their latest updates.</p>
          </div>
        ) : (
          posts.map((item) => (
            <Post
              key={item._id}
              profilePicture={item.author?.profilePicture}
              firstName={item.author?.firstName}
              lastName={item.author?.lastName}
              createdAt={item.createdAt}
              caption={item.caption}
              img={item.img}
              comments={item.comments}
              _id={item._id}
              loggedInUserId={userData._id}
              username={item.author?.username}
              likes={item.likes}
            />
          ))
        )}
      </div>

      {intialRender ? (
        <div className="flex justify-center py-10">
          <Loader />
        </div>
      ) : (
        <div ref={loderRef} className="text-center py-8">
          {flag ? <span className="text-slate-500 text-sm font-medium tracking-wide uppercase">You're all caught up</span> : <Loader />}
        </div>
      )}
    </div>
  )
}

export default Home
