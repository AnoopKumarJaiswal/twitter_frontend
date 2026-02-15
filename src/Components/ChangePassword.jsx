import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import DOMAIN from "../constants"
import { useNavigate } from "react-router-dom"

const ChangePassword = () => {

    const { firstName, lastName } = useSelector(stroe => stroe.user.data)
    const [detials, setDetials] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" })
    const [show, setShow] = useState(false)
    const [showNewPass, setshowNewPass] = useState(false)
    const [showConPass, setShowConPass] = useState(false)
    const nav = useNavigate()

    function handleChange(e) {
        setDetials({ ...detials, [e.target.name]: e.target.value })
    }


    function handleSubmit() {
        if (detials.newPassword.length < 2 || detials.oldPassword.length < 2 || detials.confirmPassword.length < 2) {
            toast.error("Please fill old and new Password")
            return
        }

        if (detials.newPassword !== detials.confirmPassword) {
            toast.error("New Password and confirm sholud be same")
            return
        }

        axios.patch(DOMAIN + "/changepassword", { oldPassword: detials.oldPassword, newPassword: detials.newPassword }, { withCredentials: true })
            .then((res) => {
                toast.success(res.data.msg)
                nav("/profile")
            })
            .catch((error) => {
                toast.error(error.response.data.error)
            })
    }
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden transition-colors duration-500">
            {/* Background Animated Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <div className="w-full max-w-lg p-8 rounded-2xl glass-card relative z-10 animate-slide-in border border-slate-700/50 shadow-2xl shadow-black/50">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 tracking-tight mb-2">
                        Change Password
                    </h1>
                    <h2 className="text-slate-400 text-lg font-medium">
                        {firstName} {lastName}
                    </h2>
                </div>

                <div className="space-y-6">
                    {/* Old Password */}
                    <div className="group">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-blue-400">
                            Enter Your Old Password
                        </label>
                        <div className="relative">
                            <input
                                onChange={handleChange}
                                name="oldPassword"
                                value={detials.oldPassword}
                                placeholder="Type your old password..."
                                type={show ? "text" : "password"}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-300 placeholder-slate-600"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-500 hover:text-slate-300 transition-colors">
                                {show ?
                                    <i className="fa-solid fa-eye-slash" onClick={() => setShow(false)}></i> :
                                    <i className="fa-solid fa-eye" onClick={() => setShow(true)}></i>
                                }
                            </div>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="group">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-purple-400">
                            Enter Your New Password
                        </label>
                        <div className="relative">
                            <input
                                onChange={handleChange}
                                name="newPassword"
                                value={detials.newPassword}
                                placeholder="Type your new password..."
                                type={showNewPass ? "text" : "password"}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all duration-300 placeholder-slate-600"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-500 hover:text-slate-300 transition-colors">
                                {showNewPass ?
                                    <i className="fa-solid fa-eye-slash" onClick={() => setshowNewPass(false)}></i> :
                                    <i className="fa-solid fa-eye" onClick={() => setshowNewPass(true)}></i>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="group">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 transition-colors group-focus-within:text-purple-400">
                            Confirm Your New Password
                        </label>
                        <div className="relative">
                            <input
                                onChange={handleChange}
                                name="confirmPassword"
                                value={detials.confirmPassword}
                                placeholder="Confirm your new password..."
                                type={showConPass ? "text" : "password"}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all duration-300 placeholder-slate-600"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-slate-500 hover:text-slate-300 transition-colors">
                                {showConPass ?
                                    <i className="fa-solid fa-eye-slash" onClick={() => setShowConPass(false)}></i> :
                                    <i className="fa-solid fa-eye" onClick={() => setShowConPass(true)}></i>
                                }
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
                    >
                        <span className="relative z-10">Change Password</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword