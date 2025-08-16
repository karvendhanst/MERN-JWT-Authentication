import React, { useContext, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import { Mail, Lock } from "lucide-react"
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const inputRef = useRef([])

  const navigate = useNavigate()

  const { backendUrl } = useContext(AppContext)

  const [email, setEmail] = useState("")
  const [newPassword, setnewPassword] = useState("")
  const [otp, setOtp] = useState(0)
  const [isemailSend, setisemailSend] = useState(false)
  const [isotpSend, setisotpSend] = useState(false)

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + "/api/auth/reset-otp", { email })
      if (data.success) {
        toast.success(data.msg)
        setisemailSend(true)
      } else {
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    const otpArray = inputRef.current.map(el => el.value)
    const otp = otpArray.join("")

    setOtp(otp)

    setisotpSend(true)

  }

  const handleNewPassSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await axios.post(backendUrl + "/api/auth/verify-reset-otp", { email,newPassword,otp })
      if (data.success) {
        toast.success(data.msg)
        navigate("/login")
      } else {
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  const handleInput = (e, index) => {

    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  }

  const handleKeydown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  }

  return (
    <div className='h-screen flex flex-col'>
      <Navbar d={"none"} />

      <div className='h-full flex items-center justify-center'>

        {!isemailSend &&
          <div className='border rounded  border-gray-300 shadow p-3 flex flex-col items-center text-center gap-3 text-gray-600'>
            <h1 className='text-2xl'>Enter Email</h1>
            <p className='bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent'>Enter Email for your account</p>

            <form onSubmit={(e) => handleEmailSubmit(e)}>


              <div className='flex items-center my-3 border border-gray-300 rounded-lg overflow-hidden w-full max-w-sm'>
                <span className="px-3 text-gray-500">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 outline-none text-gray-700"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className='text-sm cursor-pointer px-6 py-2 rounded text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] transition-all duration-300 w-1/2'>Submit</button>
            </form>

          </div>
        }


        {isemailSend && !isotpSend &&
        <div className='border rounded  border-gray-300 shadow p-3 flex flex-col items-center text-center gap-3 text-gray-600'>
          <form onSubmit={(e) => handleOtpSubmit(e)} className='text-center'>
            <h1 className='text-2xl'>Reset OTP</h1>
            <p className='bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent'>Check Email and enter Password reset OTP</p>
            {Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength={1}
                key={index}
                className="w-12 h-12 rounded border border-gray-400 mx-1 my-5 outline-blue-400 text-center text-xl"
                ref={(el) => (inputRef.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeydown(e, index)}
              />
            ))}

            <button className='text-sm cursor-pointer px-6 py-2 rounded text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] transition-all duration-300 w-1/2'>Submit</button>
          </form>
          </div>
        }

        {isemailSend && isotpSend &&
        <div className='border rounded  border-gray-300 shadow p-3 flex flex-col items-center text-center gap-3 text-gray-600'>
          <form className='text-center' onSubmit={(e) => handleNewPassSubmit(e)}>

            <h1 className='text-2xl'>New Password</h1>
            <p className='bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent'>Enter your new password</p>


            <div className='flex items-center my-3 border border-gray-300 rounded-lg overflow-hidden w-full max-w-sm'>
              <span className="px-3 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="Enter new password"
                className="flex-1 px-3 py-2 outline-none text-gray-700"
                name="newpassword"
                autoComplete='false'
                onChange={(e) => setnewPassword(e.target.value)}
              />
            </div>

            <button className='text-sm cursor-pointer px-6 py-2 rounded text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] transition-all duration-300 w-1/2'>Submit</button>
          </form>
          </div>
        }


      </div>


    </div>

  )
}

export default ResetPassword