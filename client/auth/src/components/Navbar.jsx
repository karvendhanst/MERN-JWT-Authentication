import React, { useContext } from 'react'
import logo from "../assets/logo.png"
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = (props) => {

  const { userData, isLoggedin, backendUrl, setIsLoggedIn, setuserData } = useContext(AppContext)

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/logout", {}, { withCredentials: true })
      data.success && setIsLoggedIn(false)
      data.success && setuserData(false)
      toast.success(data.msg)
      navigate("/")
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleVerifyEmail = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp", {}, { withCredentials: true })
      data.success && toast.success(data.msg)
      navigate("/email-verify")

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className='w-full border-b border-gray-200 shadow flex items-center justify-between py-2 px-5 md:px-15 text-gray-600'>
      <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate("/")}><img src={logo} alt="" className='w-10' /> <span className='text-xl'>Karvendhan</span></div>

      <div className={`${props.d == "none" && "hidden"}`}>
        {
          isLoggedin ?
            <div className='group relative px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 font-bold text-white rounded-full cursor-pointer'>
              {userData && userData.name.split("")[0].toUpperCase()}
              <ul className='absolute hidden group-hover:block right-3 top-10 px-3 py-2 text-gray-500 font-medium border border-gray-300 shadow rounded w-[120px] leading-8 bg-white'>
                {userData && userData.isAccountVerified ?
                  "" :
                  <li onClick={handleVerifyEmail} >Verify email</li>
                }

                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>

            :
            <button className='flex items-center gap-2 px-3 py-2 cursor-pointer border rounded-3xl border-gray-400'
              onClick={() => navigate("/login")}
            >Login <ArrowRight /></button>
        }
      </div>

    </nav>
  )
}

export default Navbar;