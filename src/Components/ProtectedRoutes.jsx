
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet, Link } from 'react-router-dom'
import { fetchUserData, logoutUser } from '../utils/userSlice'
import Navbar from './Navbar'
import SideBar from './SideBar'
import axios from 'axios'
import DOMAIN from '../constants'

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
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-blue-500/30 pb-20 md:pb-0">
            {/* Background ambient light */}
            <div className="fixed top-0 left-0 right-0 h-screen overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>

            <Navbar />
            <div className='flex pt-[10vh] max-w-[1600px] mx-auto relative'>
                <div className="hidden md:block sticky top-[10vh] h-[90vh] z-40">
                    <SideBar />
                </div>
                <div className="flex-1 min-h-[90vh] p-4 md:p-6 overflow-x-hidden w-full">
                    <Outlet />
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 w-full glass-nav border-t border-slate-700/50 flex justify-around items-center py-3 z-50">
                <Link to="/home" className="flex flex-col items-center text-slate-400 hover:text-blue-400 transition-colors">
                    <i className="fa-regular fa-house text-xl"></i>
                    <span className="text-[10px] mt-1">Home</span>
                </Link>
                <Link to="/profile" className="flex flex-col items-center text-slate-400 hover:text-purple-400 transition-colors">
                    <i className="fa-solid fa-user text-xl"></i>
                    <span className="text-[10px] mt-1">Profile</span>
                </Link>
                <Link to="/post" className="flex flex-col items-center text-slate-400 hover:text-emerald-400 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg transform -translate-y-4 border-4 border-[#0f172a]">
                        <i className="fa-solid fa-plus text-white text-xl"></i>
                    </div>
                </Link>
                <div onClick={() => {
                    axios.post(DOMAIN + '/signout', {}, { withCredentials: true })
                        .then(() => dispatch(logoutUser()))
                }} className="flex flex-col items-center text-slate-400 hover:text-red-400 transition-colors cursor-pointer">
                    <i className="fa-solid fa-power-off text-xl"></i>
                    <span className="text-[10px] mt-1">Logout</span>
                </div>
            </div>
        </div>
    )
        : <Navigate to={"/login"} />
}

export default ProtectedRoutes