import React, { useRef, useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Emailverify = () => {
  const inputRef = useRef([])

  const navigate = useNavigate()

  const {backendUrl, getUserData, isLoggedin, userData} = useContext(AppContext)

  const handleInput =(e,index)=>{
    
    if (e.target.value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    }
  }

  const handleKeydown =(e,index)=>{
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRef.current[index - 1].focus();
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    const otpArray = inputRef.current.map(el => el.value)
    const otp = otpArray.join("")

    try {
      const {data} = await axios.post(backendUrl+"/api/auth/verify-account", {otp}, { withCredentials: true })
      if(data.success){
        toast.success(data.msg)
        getUserData()
        navigate("/")
      }else{
        toast.error(data.msg)
      }
    } catch (error) {
      toast.error(error.message)
    }
    
  }

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate("/") 
  },[isLoggedin, userData])

  return (
    <div className='h-screen flex flex-col'>
      <Navbar d={"none"} />

      <div className='h-full flex items-center justify-center'>

        <div className='border rounded  border-gray-300 shadow p-3 flex flex-col items-center text-center gap-3 text-gray-600'>
          <h1 className='text-2xl'>Verification OTP</h1>
          <p className='bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent'>Check Email and enter Verification OTP</p>

          <form onSubmit={(e) => handleSubmit(e)}>
            {Array(6).fill(0).map((_, index) => (

              <input 
                type="text" 
                maxLength={1} 
                key={index}
                value={inputRef.current.value}
                className='w-12 h-12 rounded border border-gray-400 mx-1 my-5 outline-blue-400 text-center text-xl'
                ref={(e) => (inputRef.current[index] = e)}
                onInput={(e)=> handleInput(e, index)}
                onKeyDown={(e)=>  handleKeydown(e, index)}
              /> 
            ))}
            <button className='text-sm cursor-pointer px-6 py-2 rounded text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] transition-all duration-300 w-1/2'>Submit</button>
          </form>

        </div>

      </div>

    </div>
  )
}

export default Emailverify