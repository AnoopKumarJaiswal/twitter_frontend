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
        setInitialRender(false) // 🔥 IMPORTANT
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
    <div className="w-full">
      <div className="mx-auto">
        {posts.length == 0 ? (
          <h1>No Posts Found</h1>
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
            />
          ))
        )}
      </div>

      {intialRender ? (
        <Loader />
      ) : (
        <div ref={loderRef} className="text-center">
          {flag ? "No New Post" : <Loader />}
        </div>
      )}
    </div>
  )
}

export default Home
