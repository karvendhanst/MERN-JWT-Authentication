import React, { useContext, useState } from 'react'
import Navbar from '../components/Navbar'
import { Mail, User, Lock } from "lucide-react"
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate()

  const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext)

  const [state, setState] = useState("Sign In")

  const  [name, setName] = useState("")
  const  [email, setEmail] = useState("")
  const  [password, setpassword] = useState("")

  const handleSubmit = async(e)=>{
    
    e.preventDefault()
    if(state == "Sign In"){
      try {
        const {data} = await axios.post(backendUrl+"/api/auth/register", {name, email, password}, { withCredentials: true })
        if(data.success){
          toast.success("User registered successfully! 🎉")
          getUserData()
          setIsLoggedIn(true)
          navigate("/")
        }
        else{
          toast.error(data.msg)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }else{
      try {
        const {data} = await axios.post(backendUrl+"/api/auth/login", {email, password}, { withCredentials: true })
        if(data.success){
          toast.success("Login success! 🎉")
          getUserData()
          setIsLoggedIn(true)
          navigate("/")
        }else{
          toast.error(data.msg)
        }
      } catch (error) {
        toast.error(error.message)
      }
    }
    
  }

  return (
    <div className='h-screen flex flex-col'>
      <Navbar d={"none"}/>
      <div className='h-full flex items-center justify-center'>

        <div className='border rounded  border-gray-300 shadow p-3 flex flex-col items-center gap-3 text-gray-600'>
          <h1 className='text-2xl'>{state == "Sign In" ? "Create Account" : "Login"}</h1>
          <p className='bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent'>{state == "Sign In" ? "Register Your Account" : "Login To Your Account"}</p>

          <form onSubmit={(e)=>handleSubmit(e)}>

            {/* name */}
            {state == "Sign In" &&
            <div className='flex items-center border my-3 border-gray-300 rounded-lg overflow-hidden w-full max-w-sm'>
              <span className="px-3 text-gray-500">
                <User size={18} />
              </span>
              <input
                type="name"
                placeholder="Enter your name"
                className="flex-1 px-3 py-2 outline-none text-gray-700"
                name="name"
                value={name}
                onChange={(e)=> setName(e.target.value)}
              />
            </div>
            }

            {/* Email */}
            <div className='flex items-center my-3 border border-gray-300 rounded-lg overflow-hidden w-full max-w-sm'>
              <span className="px-3 text-gray-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 outline-none text-gray-700"
                name="email"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className='flex items-center my-3 border border-gray-300 rounded-lg overflow-hidden w-full max-w-sm'>
              <span className="px-3 text-gray-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                className="flex-1 px-3 py-2 outline-none text-gray-700"
                name="password"
                value={password}
                onChange={(e)=> setpassword(e.target.value)}
              />
            </div>

            {/* Button */}

            {state == "Log In" && <p className='text-blue-500 cursor-pointer text-sm my-3' onClick={()=> navigate("/reset-password")}>Forget Password?</p>}
            
            <button className='text-sm cursor-pointer px-6 py-2 rounded text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] transition-all duration-300 w-full'>{state == "Sign In" ? "Register" : "Login"}</button>


          <div className='text-sm my-3'>
          {state == "Sign In" ? 

          (<p>Already Have an account ? 
            <span className='text-blue-500 cursor-pointer' onClick={()=> setState("Log In")}> Login</span>
           </p>):

          (<p>You Don't Have account ? 
            <span className='text-blue-500 cursor-pointer' onClick={()=> setState("Sign In")}> Register</span>
           </p>)

          }
          </div>

            
            

          </form>
        </div>

      </div>
    </div>
  )
}

export default Login