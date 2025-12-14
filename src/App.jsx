import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import OTP from './Components/OTP'
import { Toaster } from 'react-hot-toast'
import SignUp from './Components/SignUp'
import Login from './Components/Login'
import Home from './Components/Home'
import ProtectedRoutes from './Components/ProtectedRoutes'
import { useDispatch } from 'react-redux'
import { fetchUserData } from './utils/userSlice'
import Profile from './Components/Profile'
import EditProfile from './Components/EditProfile'
import NewPost from './Components/NewPost'
import ViewProfile from './Components/ViewProfile'


const App = () => {

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetchUserData())
  // }, [])



  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/verify' element={<OTP />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login  />} />

        <Route element={<ProtectedRoutes />}>
          <Route path='/' element={<Home  />} />
          <Route path='/home' element={<Home  />} />
          <Route path='/profile' element={<Profile  />} />
          <Route path='/profile/edit' element={<EditProfile  />} />
          <Route path='/post' element={<NewPost />} />
          <Route path='/profile/:id' element={<ViewProfile />} />
        </Route>


      </Routes>
    </div>
  )
}

export default App