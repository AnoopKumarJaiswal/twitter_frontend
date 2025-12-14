
import { useEffect } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { fetchUserData } from '../utils/userSlice'
import Navbar from './Navbar'
import SideBar from './SideBar'


const ProtectedRoutes = () => {
    const userData = useSelector(store => store.user)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchUserData())
    }, [])

    if(userData.loading)
    {
        return <h1 className='bg-red-600'>Loading...</h1>
    }

    return userData.data ? <>
        <Navbar />
        <div className='flex mt-[10vh]'>
            <SideBar />
            <Outlet />
        </div>
    </>
     : <Navigate to={"/login"}/>
}

export default ProtectedRoutes