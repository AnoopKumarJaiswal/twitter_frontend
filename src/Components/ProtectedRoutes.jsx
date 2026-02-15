
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

    if (userData.loading) {
        return <h1 className='bg-red-600'>Loading...</h1>
    }

    return userData.data ? (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30">
            {/* Background ambient light */}
            <div className="fixed top-0 left-0 right-0 h-screen overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            <Navbar />
            <div className='flex pt-[10vh] max-w-[1600px] mx-auto relative'>
                <div className="sticky top-[10vh] h-[90vh] z-40">
                    <SideBar />
                </div>
                <div className="flex-1 min-h-[90vh] p-6 overflow-x-hidden">
                    <Outlet />
                </div>
            </div>
        </div>
    )
        : <Navigate to={"/login"} />
}

export default ProtectedRoutes