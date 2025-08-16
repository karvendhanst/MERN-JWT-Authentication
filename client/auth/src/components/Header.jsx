import React, { useContext } from 'react'
import welcome from "../assets/welcome.png"
import { AppContext } from '../context/AppContext'

const Header = () => {

  const {userData, isLoggedin} = useContext(AppContext)

  return (
    <div className='flex flex-col items-center gap-1 text-gray-500 text-xl'>
        <img src={welcome} alt="" className='w-35'/>
        <h1>Hello 👋 <span className='bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent text-3xl'> {isLoggedin ? userData.name : "Friends"} ! </span> </h1>
        <p>Welcome to Karvendhan's Application </p> 
        <p className='text-center leading-8 my-2 text-gray-400'>where innovation meets reliability. <br /> I excited to have you here!</p>
        <button className="text-sm cursor-pointer px-6 py-2 rounded-full text-white bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg hover:shadow-[0_0_20px_rgba(139,92,246,0.8)] transition-all duration-300">Get Started</button>

    </div>
  )
}

export default Header